import jsPDF from 'jspdf';
import 'jspdf-autotable';

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const addHeader = (doc, title) => {
  doc.setFontSize(20);
  doc.setTextColor(40);
  doc.text(title, 15, 20);
  doc.setFontSize(12);
  doc.text(`Generated on: ${formatDate(new Date())}`, 15, 30);
  doc.line(15, 35, 195, 35);
};

const addEmployeeInfo = (doc, employee, startY) => {
  doc.setFontSize(12);
  doc.text(`Name: ${employee.name}`, 15, startY);
  doc.text(`Department: ${employee.department}`, 15, startY + 7);
  doc.text(`Position: ${employee.position}`, 15, startY + 14);
  doc.line(15, startY + 20, 195, startY + 20);
  return startY + 25;
};

const addStatistics = (doc, statistics, startY) => {
  doc.setFontSize(14);
  doc.text('Evaluation Statistics', 15, startY);
  doc.setFontSize(12);
  
  const stats = [
    ['Overall Rating', statistics.averageOverallRating.toFixed(2)],
    ['Total Evaluations', statistics.totalEvaluations.toString()],
    ['Department Average', statistics.departmentAverage.toFixed(2)],
    ['Last Evaluation', formatDate(statistics.lastEvaluationDate)]
  ];

  doc.autoTable({
    startY: startY + 5,
    head: [['Metric', 'Value']],
    body: stats,
    margin: { left: 15 },
    theme: 'grid'
  });

  return doc.lastAutoTable.finalY + 10;
};

const addRatingsChart = (doc, ratings, startY) => {
  doc.setFontSize(14);
  doc.text('Detailed Ratings', 15, startY);
  
  const ratingData = ratings.map(rating => [
    rating.questionId,
    rating.averageRating.toFixed(2),
    rating.totalResponses.toString()
  ]);

  doc.autoTable({
    startY: startY + 5,
    head: [['Category', 'Average Rating', 'Total Responses']],
    body: ratingData,
    margin: { left: 15 },
    theme: 'grid'
  });

  return doc.lastAutoTable.finalY + 10;
};

const addFeedbackSection = (doc, feedback, startY) => {
  doc.setFontSize(14);
  doc.text('Recent Feedback', 15, startY);

  const feedbackData = feedback.map(item => [
    formatDate(item.date),
    item.evaluator.name,
    item.feedback
  ]);

  doc.autoTable({
    startY: startY + 5,
    head: [['Date', 'Evaluator', 'Feedback']],
    body: feedbackData,
    margin: { left: 15 },
    theme: 'grid',
    columnStyles: {
      2: { cellWidth: 100 }
    }
  });

  return doc.lastAutoTable.finalY + 10;
};

const addDepartmentStats = (doc, stats, startY) => {
  doc.setFontSize(14);
  doc.text('Department Statistics', 15, startY);

  const departmentData = [
    ['Total Employees', stats.totalEmployees.toString()],
    ['Completed Evaluations', stats.evaluationCompletion.completed.toString()],
    ['Pending Evaluations', stats.evaluationCompletion.pending.toString()],
    ['Average Rating', stats.averageRating.toFixed(2)]
  ];

  doc.autoTable({
    startY: startY + 5,
    head: [['Metric', 'Value']],
    body: departmentData,
    margin: { left: 15 },
    theme: 'grid'
  });

  return doc.lastAutoTable.finalY + 10;
};

const addEmployeePerformance = (doc, employees, startY) => {
  doc.setFontSize(14);
  doc.text('Employee Performance Overview', 15, startY);

  const employeeData = employees.map(emp => [
    emp.employee.name,
    emp.employee.position,
    emp.evaluations.toString(),
    emp.averageRating.toFixed(2)
  ]);

  doc.autoTable({
    startY: startY + 5,
    head: [['Name', 'Position', 'Evaluations', 'Average Rating']],
    body: employeeData,
    margin: { left: 15 },
    theme: 'grid'
  });

  return doc.lastAutoTable.finalY + 10;
};

export const exportToPDF = ({ title, data, type }) => {
  const doc = new jsPDF();
  let currentY = 40;

  addHeader(doc, title);

  if (type === 'employee-report') {
    currentY = addEmployeeInfo(doc, data.employee, currentY);
    currentY = addStatistics(doc, data.statistics, currentY);
    
    // Add page break if needed
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }
    
    currentY = addRatingsChart(doc, data.ratings, currentY);
    
    // Add page break if needed
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }
    
    currentY = addFeedbackSection(doc, data.feedback, currentY);
  } 
  else if (type === 'department-report') {
    currentY = addDepartmentStats(doc, data.statistics, currentY);
    
    // Add page break if needed
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }
    
    currentY = addEmployeePerformance(doc, data.employees, currentY);
  }

  // Save the PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}-${formatDate(new Date())}.pdf`);
};