import JSZip from 'jszip';
import { JAVA_PROJECT_FILES } from '../data/javaProjectCode';

export async function downloadJavaProjectZip(): Promise<void> {
  const zip = new JSZip();

  // Root project folder
  const root = zip.folder('PalIndustriesPayroll_Java_MiniProject');
  if (!root) return;

  // Source directories corresponding to package structure
  const src = root.folder('src');
  const pkgBase = src?.folder('com')?.folder('palindustries')?.folder('payroll');

  const modelPkg = pkgBase?.folder('model');
  const servicePkg = pkgBase?.folder('service');
  const dbPkg = pkgBase?.folder('db');
  const daoPkg = pkgBase?.folder('dao');
  const guiPkg = pkgBase?.folder('gui');

  // Distribute files according to packages
  for (const file of JAVA_PROJECT_FILES) {
    if (file.fileName === 'Employee.java' || 
        file.fileName === 'PermanentEmployee.java' || 
        file.fileName === 'ContractEmployee.java' || 
        file.fileName === 'InternEmployee.java') {
      modelPkg?.file(file.fileName, file.code);
    } else if (file.fileName === 'PayrollCalculator.java') {
      servicePkg?.file(file.fileName, file.code);
    } else if (file.fileName === 'DatabaseConnection.java') {
      dbPkg?.file(file.fileName, file.code);
    } else if (file.fileName === 'EmployeeManager.java') {
      daoPkg?.file(file.fileName, file.code);
    } else if (file.fileName === 'LoginFrame.java' || 
               file.fileName === 'Dashboard.java' || 
               file.fileName === 'SalarySlip.java') {
      guiPkg?.file(file.fileName, file.code);
    } else if (file.fileName === 'Main.java') {
      pkgBase?.file(file.fileName, file.code);
    } else {
      // schema.sql, README.md, etc. at root
      root.file(file.fileName, file.code);
    }
  }

  // Add sample MySQL driver documentation and pom.xml / build.xml hint
  root.file('pom.xml', `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.palindustries</groupId>
    <artifactId>payroll-system</artifactId>
    <version>1.0.0</version>
    <name>PAL INDUSTRIES - Employee Payroll Management System</name>
    <description>Chairman: ANKUR PAL | B.Tech CSE Java Mini Project</description>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <!-- MySQL JDBC Connector -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <version>8.3.0</version>
        </dependency>
    </dependencies>
</project>
`);

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'PAL_INDUSTRIES_Java_Payroll_Project.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
