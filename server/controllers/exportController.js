import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { Parser } from 'json2csv';
import { findCalculationById, listCalculations } from '../models/calculationModel.js';
import logger from '../utils/logger.js';

export async function exportCsv(req, res) {
  const { id } = req.params;
  const calculation = await findCalculationById(id, req.user.id);
  if (!calculation) {
    return res.status(404).json({ message: 'Calculation not found' });
  }

  const parser = new Parser();
  const csv = parser.parse([calculation]);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=calculation-${id}.csv`);
  return res.send(csv);
}

export async function exportExcel(req, res) {
  const { id } = req.params;
  const calculation = await findCalculationById(id, req.user.id);
  if (!calculation) {
    return res.status(404).json({ message: 'Calculation not found' });
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Calculation');
  sheet.columns = Object.keys(calculation).map((key) => ({ header: key, key }));
  sheet.addRow(calculation);

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=calculation-${id}.xlsx`);
  await workbook.xlsx.write(res);
  res.end();
}

export async function exportPdf(req, res) {
  const { id } = req.params;
  const calculation = await findCalculationById(id, req.user.id);
  if (!calculation) {
    return res.status(404).json({ message: 'Calculation not found' });
  }

  const doc = new PDFDocument({ margin: 50 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=calculation-${id}.pdf`);
  doc.pipe(res);
  doc.fontSize(20).text('DevOff Commission Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12);
  Object.entries(calculation).forEach(([key, value]) => {
    doc.text(`${key}: ${value}`);
  });
  doc.end();
}

export async function bulkExport(req, res) {
  const { ids = [], format = 'csv' } = req.body;
  const data = await listCalculations(req.user.id, { page: 1, pageSize: ids.length || 1000 });
  const filtered = ids.length ? data.items.filter((item) => ids.includes(String(item.id)) || ids.includes(item.id)) : data.items;

  if (format === 'csv') {
  if (!filtered.length) {
    return res.status(404).json({ message: 'No calculations available for export' });
  }

  const parser = new Parser();
  const csv = parser.parse(filtered);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=calculations.csv');
    return res.send(csv);
  }

  if (format === 'excel') {
    if (!filtered.length) {
      return res.status(404).json({ message: 'No calculations available for export' });
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Calculations');
    sheet.columns = Object.keys(filtered[0] || {}).map((key) => ({ header: key, key }));
    filtered.forEach((item) => sheet.addRow(item));
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=calculations.xlsx');
    await workbook.xlsx.write(res);
    res.end();
    return;
  }

  if (format === 'pdf') {
    if (!filtered.length) {
      return res.status(404).json({ message: 'No calculations available for export' });
    }

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=calculations.pdf');
    doc.pipe(res);
    doc.fontSize(20).text('DevOff Commission Portfolio', { align: 'center' });
    doc.moveDown();
    filtered.forEach((item) => {
      doc.fontSize(14).text(item.project_name, { underline: true });
      Object.entries(item).forEach(([key, value]) => {
        if (['project_name', 'id', 'user_id'].includes(key)) return;
        doc.fontSize(10).text(`${key}: ${value}`);
      });
      doc.moveDown();
    });
    doc.end();
    return;
  }

  logger.warn('Unsupported export format requested: %s', format);
  return res.status(400).json({ message: 'Unsupported export format' });
}
