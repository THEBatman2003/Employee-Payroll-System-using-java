import React, { useState } from 'react';
import { 
  Code2, 
  Download, 
  Copy, 
  Check, 
  FolderTree, 
  FileCode, 
  Database, 
  BookOpen, 
  Terminal, 
  Sparkles,
  HelpCircle,
  ExternalLink,
  Layers,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { JAVA_PROJECT_FILES } from '../data/javaProjectCode';
import { downloadJavaProjectZip } from '../services/zipExportService';
import { COMPANY_INFO } from '../data/initialData';

export const JavaCodeHubView: React.FC = () => {
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(1); // Employee.java default
  const [copiedFile, setCopiedFile] = useState<boolean>(false);
  const [activeHubTab, setActiveHubTab] = useState<'code' | 'schema' | 'oop-viva' | 'ide-run' | 'test-cases'>('code');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const activeFile = JAVA_PROJECT_FILES[selectedFileIndex] || JAVA_PROJECT_FILES[0];
  const schemaFile = JAVA_PROJECT_FILES.find(f => f.fileName === 'schema.sql');

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const handleZipDownload = async () => {
    setIsExporting(true);
    try {
      await downloadJavaProjectZip();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Top Banner with Zip Download CTA */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            <span>B.Tech CSE Java Mini Project Hub • PAL INDUSTRIES</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Java Swing + JDBC + MySQL Architecture
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Complete, pure Java desktop project ready to run in <strong>IntelliJ IDEA, NetBeans, or Eclipse</strong>. Includes Object-Oriented polymorphism models, prepared statements, MySQL relational database schema, and viva presentation documentation.
          </p>
        </div>

        <button
          onClick={handleZipDownload}
          disabled={isExporting}
          className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2.5 transition-all transform hover:scale-[1.02] cursor-pointer shrink-0 border border-amber-300"
        >
          {isExporting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></span>
              Generating ZIP Package...
            </span>
          ) : (
            <>
              <Download className="w-5 h-5 text-slate-950" />
              <span>Download Complete Java Project (.ZIP)</span>
            </>
          )}
        </button>
      </div>

      {/* Hub Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        <button
          onClick={() => setActiveHubTab('code')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeHubTab === 'code'
              ? 'bg-slate-900 text-amber-400 shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Java Source Code Explorer</span>
        </button>

        <button
          onClick={() => setActiveHubTab('schema')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeHubTab === 'schema'
              ? 'bg-slate-900 text-amber-400 shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>MySQL Database Schema (SQL)</span>
        </button>

        <button
          onClick={() => setActiveHubTab('oop-viva')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeHubTab === 'oop-viva'
              ? 'bg-slate-900 text-amber-400 shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>OOP Concepts & Viva Questions</span>
        </button>

        <button
          onClick={() => setActiveHubTab('ide-run')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeHubTab === 'ide-run'
              ? 'bg-slate-900 text-amber-400 shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>IDE Run Guide (NetBeans / IntelliJ / Eclipse)</span>
        </button>

        <button
          onClick={() => setActiveHubTab('test-cases')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeHubTab === 'test-cases'
              ? 'bg-slate-900 text-amber-400 shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Sample Test Cases & Scenarios</span>
        </button>
      </div>

      {/* Tab 1: Java Source Code Explorer */}
      {activeHubTab === 'code' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* File Tree (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FolderTree className="w-4 h-4 text-amber-500" />
                Project File Tree
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {JAVA_PROJECT_FILES.length} Files
              </span>
            </div>

            <div className="space-y-1">
              {JAVA_PROJECT_FILES.map((file, idx) => {
                const isSelected = selectedFileIndex === idx;
                return (
                  <button
                    key={file.fileName}
                    onClick={() => setSelectedFileIndex(idx)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'bg-slate-900 text-amber-400 font-bold shadow-sm'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <FileCode className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-400 group-hover:text-amber-500'}`} />
                      <span className="truncate">{file.fileName}</span>
                    </div>

                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      isSelected 
                        ? 'bg-slate-800 text-slate-300' 
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {file.category}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
              Package: <code className="text-slate-600 font-mono">com.palindustries.payroll</code>
            </div>
          </div>

          {/* Code Viewer (8 cols) */}
          <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden text-slate-200">
            
            {/* Top Toolbar */}
            <div className="bg-slate-900 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-amber-400 flex items-center gap-2">
                  <FileCode className="w-4 h-4" />
                  {activeFile.fileName}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {activeFile.description}
                </p>
              </div>

              <button
                onClick={() => handleCopyCode(activeFile.code)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
              >
                {copiedFile ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Copy File Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Body */}
            <div className="p-5 font-mono text-xs leading-relaxed overflow-x-auto max-h-[600px] overflow-y-auto bg-slate-950 text-slate-300">
              <pre>
                <code>{activeFile.code}</code>
              </pre>
            </div>

            {/* Footer */}
            <div className="px-5 py-2.5 bg-slate-900/80 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Lines: {activeFile.code.split('\n').length}</span>
              <span>PAL INDUSTRIES • B.Tech CSE Mini Project</span>
            </div>

          </div>

        </div>
      )}

      {/* Tab 2: MySQL Database Schema */}
      {activeHubTab === 'schema' && (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden text-slate-200">
          <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400" />
                <span>MySQL Schema: pal_industries_payroll</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Tables: admin, departments, employees, payroll (Includes foreign keys and seed records)
              </p>
            </div>

            <button
              onClick={() => handleCopyCode(schemaFile?.code || '')}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-amber-400" />
              <span>Copy SQL Script</span>
            </button>
          </div>

          <div className="p-6 font-mono text-xs leading-relaxed overflow-x-auto max-h-[620px] overflow-y-auto bg-slate-950 text-emerald-300/90">
            <pre>
              <code>{schemaFile?.code}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: OOP Concepts & Viva Guide */}
      {activeHubTab === 'oop-viva' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Core Java OOP Principles Demonstrated in this Project
              </h3>
              <p className="text-xs text-slate-500">
                Use these structured explanations during project presentation and external viva examination
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Encapsulation */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center gap-2 text-sky-800 font-bold text-sm">
                  <span className="w-6 h-6 rounded-lg bg-sky-100 flex items-center justify-center text-xs">1</span>
                  <h4>Encapsulation</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  In <code className="font-mono text-slate-800 font-bold">Employee.java</code>, all attributes (<code className="font-mono">employeeId, basicSalary, contactNumber, email</code>, etc.) are declared <strong>private</strong>. They can only be accessed or modified through public getter and setter methods with boundary checks, shielding sensitive payroll figures from unauthorized direct mutation.
                </p>
              </div>

              {/* Inheritance */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                  <span className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center text-xs">2</span>
                  <h4>Inheritance</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Classes <code className="font-mono text-slate-800 font-bold">PermanentEmployee</code>, <code className="font-mono text-slate-800 font-bold">ContractEmployee</code>, and <code className="font-mono text-slate-800 font-bold">InternEmployee</code> extend the base class <code className="font-mono text-slate-800 font-bold">Employee</code> using the <code className="font-mono text-amber-700">extends</code> keyword. They inherit all common properties and invoke the parent constructor via <code className="font-mono text-amber-700">super(...)</code>.
                </p>
              </div>

              {/* Polymorphism */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-xs">3</span>
                  <h4>Dynamic Polymorphism (Runtime Dispatch)</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  In <code className="font-mono text-slate-800 font-bold">PayrollCalculator.computeBreakdown(Employee emp)</code>, the method takes a parent <code className="font-mono text-emerald-700">Employee</code> reference. At runtime, the JVM automatically invokes the correct overridden allowance/deduction methods depending on whether the object is an instance of Permanent, Contract, or Intern.
                </p>
              </div>

              {/* Method Overriding */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center gap-2 text-purple-800 font-bold text-sm">
                  <span className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center text-xs">4</span>
                  <h4>Method Overriding (@Override)</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Each derived employee class provides specialized implementations:
                  <br />• <strong>Permanent:</strong> 20% HRA, 10% DA, 5% Medical, 12% PF, ₹1000 Transport.
                  <br />• <strong>Contract:</strong> 15% HRA, 8% DA, 3% Medical, 0% PF, ₹800 Transport.
                  <br />• <strong>Intern:</strong> ₹0 HRA/DA/Med/PF, ₹500 Transport stipend subsidy.
                </p>
              </div>

              {/* Abstraction */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                  <span className="w-6 h-6 rounded-lg bg-rose-100 flex items-center justify-center text-xs">5</span>
                  <h4>Abstraction</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <code className="font-mono text-slate-800 font-bold">Employee</code> is declared as an <strong>abstract class</strong> containing abstract signatures: <code className="font-mono text-rose-700">abstract double calculateHRA();</code> etc. It cannot be directly instantiated without defining concrete allowance rules.
                </p>
              </div>

              {/* JDBC & PreparedStatement */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center gap-2 text-indigo-800 font-bold text-sm">
                  <span className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center text-xs">6</span>
                  <h4>JDBC & SQL Injection Prevention</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <code className="font-mono text-slate-800 font-bold">EmployeeManager.java</code> uses <code className="font-mono text-indigo-700">PreparedStatement</code> parameterized queries (<code className="font-mono">?</code> placeholders) for all INSERT, UPDATE, and SELECT operations, completely mitigating SQL Injection vulnerabilities.
                </p>
              </div>

            </div>
          </div>

          {/* Frequently Asked Viva Questions */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Top Viva Questions and Answers for Examiners
            </h3>

            <div className="space-y-3 text-xs">
              <details className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 open:bg-white transition-all">
                <summary className="font-bold text-slate-800 cursor-pointer">
                  Q1: Why did you use an abstract class for Employee instead of an interface?
                </summary>
                <p className="mt-2 text-slate-600 leading-relaxed pl-3 border-l-2 border-amber-400">
                  <strong>Answer:</strong> An abstract class allows us to share common state attributes (such as <code className="font-mono">employeeId, name, department, basicSalary</code>) and shared concrete methods (<code className="font-mono">calculateGrossSalary(), calculateNetSalary()</code>), while simultaneously forcing subclasses to define their specific allowance and deduction formulas. An interface cannot store non-static instance state.
                </p>
              </details>

              <details className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 open:bg-white transition-all">
                <summary className="font-bold text-slate-800 cursor-pointer">
                  Q2: How does the application handle database disconnection or missing MySQL server?
                </summary>
                <p className="mt-2 text-slate-600 leading-relaxed pl-3 border-l-2 border-amber-400">
                  <strong>Answer:</strong> <code className="font-mono">DatabaseConnection.java</code> encapsulates JDBC initialization in a robust try-catch block. If the MySQL server or driver is offline, it provides structured logging and graceful fallback authentication for the initial demo administrator, preventing runtime application crashes.
                </p>
              </details>

              <details className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 open:bg-white transition-all">
                <summary className="font-bold text-slate-800 cursor-pointer">
                  Q3: How is duplicate Employee ID prevented?
                </summary>
                <p className="mt-2 text-slate-600 leading-relaxed pl-3 border-l-2 border-amber-400">
                  <strong>Answer:</strong> Two levels of validation are enforced: (1) In GUI/business layer, <code className="font-mono">employeeExists(id)</code> query executes before submission, and (2) in the MySQL database, <code className="font-mono">employee_id</code> is defined as the PRIMARY KEY, enforcing unique relational integrity.
                </p>
              </details>

              <details className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 open:bg-white transition-all">
                <summary className="font-bold text-slate-800 cursor-pointer">
                  Q4: What formula is used to calculate Gross Salary and Net Salary?
                </summary>
                <p className="mt-2 text-slate-600 leading-relaxed pl-3 border-l-2 border-amber-400">
                  <strong>Answer:</strong>
                  <br />• Gross Salary = Basic Salary + HRA (20%) + DA (10%) + Medical Allowance (5%) + Transport Allowance (₹1,000).
                  <br />• Total Deductions = Provident Fund (12%) + Professional Tax (₹200) + Other Deductions.
                  <br />• Net Salary = Gross Salary - Total Deductions.
                </p>
              </details>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: IDE Run Guide */}
      {activeHubTab === 'ide-run' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Step-by-Step IDE Execution Guide
            </h3>
            <p className="text-xs text-slate-500">
              How to import and run PAL INDUSTRIES Payroll System in NetBeans, IntelliJ IDEA, or Eclipse
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            
            {/* NetBeans */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                  NB
                </div>
                <h4>Apache NetBeans IDE</h4>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-slate-600 leading-relaxed">
                <li>Download the project ZIP and extract to folder.</li>
                <li>In NetBeans: <strong>File &gt; New Project &gt; Java with Ant &gt; Java Application</strong>.</li>
                <li>Set project name: <code>PalIndustriesPayroll</code>.</li>
                <li>Copy <code>com/palindustries/payroll/...</code> into <code>src/</code>.</li>
                <li>Right click <strong>Libraries &gt; Add JAR/Folder</strong> and select <code>mysql-connector-j.jar</code>.</li>
                <li>Right-click <code>Main.java</code> &gt; <strong>Run File (Shift+F6)</strong>.</li>
              </ol>
            </div>

            {/* IntelliJ IDEA */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  IJ
                </div>
                <h4>IntelliJ IDEA</h4>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-slate-600 leading-relaxed">
                <li>Open IntelliJ &gt; <strong>Open</strong> &gt; Select extracted project folder.</li>
                <li>Press <strong>Ctrl+Alt+Shift+S</strong> (Project Structure).</li>
                <li>Under <strong>Project Settings &gt; Modules &gt; Dependencies</strong>, click <strong>+ &gt; JARs or Directories</strong>.</li>
                <li>Select MySQL JDBC connector jar.</li>
                <li>Open <code>Main.java</code> and click the green Run arrow.</li>
              </ol>
            </div>

            {/* Eclipse */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  EC
                </div>
                <h4>Eclipse IDE</h4>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-slate-600 leading-relaxed">
                <li>Go to <strong>File &gt; New &gt; Java Project</strong>.</li>
                <li>Name project <code>PalIndustriesPayroll</code>.</li>
                <li>Import extracted <code>src</code> files.</li>
                <li>Right-click project &gt; <strong>Build Path &gt; Configure Build Path &gt; Add External JARs</strong>.</li>
                <li>Select <code>mysql-connector-j.jar</code>.</li>
                <li>Run <code>Main.java</code> as Java Application.</li>
              </ol>
            </div>

          </div>

          {/* Command Line Run */}
          <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs space-y-2">
            <span className="text-amber-400 font-bold block">Run directly via CLI (Bash / CMD):</span>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-emerald-400 select-all">
              # 1. Compile all Java sources with MySQL connector<br />
              javac -cp "lib/mysql-connector-j-8.3.0.jar:." src/com/palindustries/payroll/**/*.java -d bin/<br />
              <br />
              # 2. Execute Main class<br />
              java -cp "bin:lib/mysql-connector-j-8.3.0.jar" com.palindustries.payroll.Main
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Sample Test Cases */}
      {activeHubTab === 'test-cases' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Sample Verification Test Cases
            </h3>
            <p className="text-xs text-slate-500">
              Standardized test scenarios for demonstrating validation, arithmetic accuracy, and database persistence
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-900 text-white font-semibold uppercase">
                <tr>
                  <th className="py-2.5 px-3">Test Case ID</th>
                  <th className="py-2.5 px-3">Feature Under Test</th>
                  <th className="py-2.5 px-3">Input Data</th>
                  <th className="py-2.5 px-3">Expected Result</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold">TC-PAY-01</td>
                  <td className="py-2.5 px-3 font-semibold">Permanent Salary Math</td>
                  <td className="py-2.5 px-3">Basic = ₹85,000</td>
                  <td className="py-2.5 px-3">Gross = ₹1,15,750 (HRA 20%, DA 10%, Med 5%, Trans 1000). Net = ₹1,05,350</td>
                  <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">PASS</span></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold">TC-PAY-02</td>
                  <td className="py-2.5 px-3 font-semibold">Contract Salary Math</td>
                  <td className="py-2.5 px-3">Basic = ₹48,000</td>
                  <td className="py-2.5 px-3">Gross = ₹61,280 (HRA 15%, DA 8%, Med 3%, Trans 800). PF = ₹0, Net = ₹61,080</td>
                  <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">PASS</span></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold">TC-PAY-03</td>
                  <td className="py-2.5 px-3 font-semibold">Intern Stipend Math</td>
                  <td className="py-2.5 px-3">Basic = ₹25,000</td>
                  <td className="py-2.5 px-3">Gross = ₹25,500 (Transport subsidy ₹500, exempt HRA/DA/PF/PT). Net = ₹25,500</td>
                  <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">PASS</span></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold">TC-EMP-04</td>
                  <td className="py-2.5 px-3 font-semibold">Duplicate ID Prevention</td>
                  <td className="py-2.5 px-3">ID: PI-101 (Already existing)</td>
                  <td className="py-2.5 px-3">System halts with error dialog "Employee ID already exists"</td>
                  <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">PASS</span></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold">TC-AUTH-05</td>
                  <td className="py-2.5 px-3 font-semibold">Admin Login Validation</td>
                  <td className="py-2.5 px-3">admin / admin123</td>
                  <td className="py-2.5 px-3">Grants access to executive dashboard and loads KPI counters</td>
                  <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">PASS</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
