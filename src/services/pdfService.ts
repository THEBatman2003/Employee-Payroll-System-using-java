import { jsPDF } from 'jspdf';
import { Employee, SalaryBreakdown } from '../types';
import { COMPANY_INFO } from '../data/initialData';
import { numberToWordsIndian } from './payrollService';

export function generateSalarySlipPDF(
  employee: Employee,
  breakdown: SalaryBreakdown,
  payMonth: string,
  transactionRef: string = 'NEFT-' + Math.floor(1000000 + Math.random() * 9000000)
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  let y = 14;

  // Outer Border with Golden/Navy corporate double stroke
  doc.setDrawColor(15, 23, 42); // Navy
  doc.setLineWidth(0.8);
  doc.rect(margin, margin, pageWidth - margin * 2, 268);

  doc.setDrawColor(212, 175, 55); // Gold
  doc.setLineWidth(0.3);
  doc.rect(margin + 1.5, margin + 1.5, pageWidth - margin * 2 - 3, 265);

  // Header Banner
  doc.setFillColor(15, 23, 42); // Navy background
  doc.rect(margin + 2, margin + 2, pageWidth - margin * 2 - 4, 30, 'F');

  // PI Monogram Badge
  doc.setFillColor(212, 175, 55); // Gold
  doc.roundedRect(margin + 6, margin + 5, 22, 24, 2, 2, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('PI', margin + 17, margin + 20, { align: 'center' });

  // Company Name & Details
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.text(COMPANY_INFO.name, margin + 32, margin + 12);

  doc.setTextColor(212, 175, 55); // Gold
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Chairman: ${COMPANY_INFO.chairman}`, margin + 32, margin + 18);

  doc.setTextColor(203, 213, 225); // Slate
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`${COMPANY_INFO.headquarters} | CIN: ${COMPANY_INFO.cin}`, margin + 32, margin + 24);

  y = margin + 36;

  // Payslip Title Bar
  doc.setFillColor(241, 245, 249);
  doc.rect(margin + 2, y, pageWidth - margin * 2 - 4, 9, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.line(margin + 2, y + 9, pageWidth - margin - 2, y + 9);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`OFFICIAL SALARY SLIP FOR THE MONTH OF ${payMonth.toUpperCase()}`, pageWidth / 2, y + 6.5, { align: 'center' });

  y += 14;

  // Employee Information Grid
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);

  const leftColX = margin + 6;
  const leftValX = margin + 42;
  const rightColX = pageWidth / 2 + 6;
  const rightValX = pageWidth / 2 + 42;

  // Row 1
  doc.text('Employee ID:', leftColX, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(employee.id, leftValX, y);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Department:', rightColX, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(employee.department, rightValX, y);

  y += 6;

  // Row 2
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Employee Name:', leftColX, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(employee.name, leftValX, y);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Designation:', rightColX, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(employee.designation, rightValX, y);

  y += 6;

  // Row 3
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Category (OOP):', leftColX, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${employee.category} EMPLOYEE`, leftValX, y);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Date of Joining:', rightColX, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(employee.joiningDate, rightValX, y);

  y += 6;

  // Row 4
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Bank Txn Ref:', leftColX, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(transactionRef, leftValX, y);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Generation Date:', rightColX, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(new Date().toISOString().split('T')[0], rightValX, y);

  y += 10;

  // Two Column Table: EARNINGS vs DEDUCTIONS
  const tableWidth = (pageWidth - margin * 2 - 8) / 2;
  const leftTableX = margin + 2;
  const rightTableX = leftTableX + tableWidth + 4;

  // Table Headers
  doc.setFillColor(15, 23, 42);
  doc.rect(leftTableX, y, tableWidth, 8, 'F');
  doc.rect(rightTableX, y, tableWidth, 8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('EARNINGS & ALLOWANCES', leftTableX + 4, y + 5.5);
  doc.text('AMOUNT (Rs.)', leftTableX + tableWidth - 4, y + 5.5, { align: 'right' });

  doc.text('STATUTORY DEDUCTIONS', rightTableX + 4, y + 5.5);
  doc.text('AMOUNT (Rs.)', rightTableX + tableWidth - 4, y + 5.5, { align: 'right' });

  y += 8;

  const earningsRows = [
    { label: 'Basic Salary', val: breakdown.basicSalary },
    { label: 'House Rent Allowance (HRA)', val: breakdown.hra },
    { label: 'Dearness Allowance (DA)', val: breakdown.da },
    { label: 'Medical Allowance', val: breakdown.medicalAllowance },
    { label: 'Transport Allowance', val: breakdown.transportAllowance },
  ];

  const deductionsRows = [
    { label: 'Provident Fund (PF - 12%)', val: breakdown.pf },
    { label: 'Professional Tax (PT)', val: breakdown.professionalTax },
    { label: 'Other Deductions / TDS', val: breakdown.otherDeductions },
    { label: 'Leave / LOP Deductions', val: 0 },
    { label: 'Health Insurance Premium', val: 0 },
  ];

  const rowHeight = 7.5;
  for (let i = 0; i < 5; i++) {
    const isEven = i % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(leftTableX, y, tableWidth, rowHeight, 'F');
    doc.rect(rightTableX, y, tableWidth, rowHeight, 'F');

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.1);
    doc.line(leftTableX, y + rowHeight, leftTableX + tableWidth, y + rowHeight);
    doc.line(rightTableX, y + rowHeight, rightTableX + tableWidth, y + rowHeight);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);

    // Earnings
    doc.text(earningsRows[i].label, leftTableX + 4, y + 5);
    doc.text(earningsRows[i].val.toLocaleString('en-IN', { minimumFractionDigits: 2 }), leftTableX + tableWidth - 4, y + 5, { align: 'right' });

    // Deductions
    doc.text(deductionsRows[i].label, rightTableX + 4, y + 5);
    doc.text(deductionsRows[i].val.toLocaleString('en-IN', { minimumFractionDigits: 2 }), rightTableX + tableWidth - 4, y + 5, { align: 'right' });

    y += rowHeight;
  }

  // Subtotal rows
  doc.setFillColor(241, 245, 249);
  doc.rect(leftTableX, y, tableWidth, 8, 'F');
  doc.rect(rightTableX, y, tableWidth, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('TOTAL GROSS SALARY', leftTableX + 4, y + 5.5);
  doc.text(`Rs. ${breakdown.grossSalary.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, leftTableX + tableWidth - 4, y + 5.5, { align: 'right' });

  doc.text('TOTAL DEDUCTIONS', rightTableX + 4, y + 5.5);
  doc.text(`Rs. ${breakdown.totalDeductions.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, rightTableX + tableWidth - 4, y + 5.5, { align: 'right' });

  y += 14;

  // NET SALARY HIGHLIGHT BOX
  doc.setFillColor(15, 23, 42); // Navy
  doc.rect(margin + 2, y, pageWidth - margin * 2 - 4, 16, 'F');

  // Gold accent line on left of net box
  doc.setFillColor(212, 175, 55);
  doc.rect(margin + 2, y, 4, 16, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('NET SALARY PAYABLE:', margin + 10, y + 10);

  doc.setTextColor(212, 175, 55); // Gold
  doc.setFontSize(15);
  doc.text(`Rs. ${breakdown.netSalary.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, pageWidth - margin - 8, y + 11, { align: 'right' });

  y += 21;

  // Amount in Words
  doc.setFillColor(248, 250, 252);
  doc.rect(margin + 2, y, pageWidth - margin * 2 - 4, 10, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin + 2, y, pageWidth - margin * 2 - 4, 10, 'S');

  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Amount in Words:', margin + 6, y + 6.5);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'normal');
  doc.text(numberToWordsIndian(breakdown.netSalary), margin + 35, y + 6.5);

  y += 22;

  // Authorization and Signatures Section
  const signColWidth = (pageWidth - margin * 2 - 20) / 3;

  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.3);

  // Col 1: Prepared By (HR)
  doc.line(margin + 6, y + 16, margin + 6 + signColWidth, y + 16);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Prepared by HR Payroll Dept', margin + 6 + signColWidth / 2, y + 21, { align: 'center' });

  // Col 2: Employee Signature
  doc.line(margin + 12 + signColWidth, y + 16, margin + 12 + signColWidth * 2, y + 16);
  doc.text('Employee Signature / Acknowledgement', margin + 12 + signColWidth * 1.5, y + 21, { align: 'center' });

  // Col 3: Authorized by ANKUR PAL, Chairman
  doc.line(margin + 18 + signColWidth * 2, y + 16, margin + 18 + signColWidth * 3, y + 16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('ANKUR PAL', margin + 18 + signColWidth * 2.5, y + 10, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(212, 175, 55);
  doc.setFontSize(8.5);
  doc.text('Authorized by: ANKUR PAL, Chairman', margin + 18 + signColWidth * 2.5, y + 21, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7.5);
  doc.text('PAL INDUSTRIES', margin + 18 + signColWidth * 2.5, y + 25, { align: 'center' });

  // Official Stamp Watermark
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.5);
  doc.circle(pageWidth / 2, y + 12, 12);
  doc.setTextColor(212, 175, 55);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.text('PAL INDUSTRIES', pageWidth / 2, y + 9, { align: 'center' });
  doc.text('OFFICIAL SEAL', pageWidth / 2, y + 13, { align: 'center' });
  doc.text('PAYROLL AUTH', pageWidth / 2, y + 17, { align: 'center' });

  // Footer note
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'This is a computer-generated salary document from the PAL INDUSTRIES Payroll Management System. Chairman: ANKUR PAL.',
    pageWidth / 2,
    276,
    { align: 'center' }
  );

  // Save PDF
  const filename = `SalarySlip_${employee.id}_${payMonth.replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
}
