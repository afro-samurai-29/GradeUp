import React from 'react';
import StudentNavbar from './StudentNavbar';
import AIChatbot from './AIChatbot';

interface StudentLayoutProps {
  children: React.ReactNode;
}

const StudentLayout: React.FC<StudentLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <StudentNavbar />
      <main className="lg:ml-0">
        {children}
      </main>
      <AIChatbot />
    </div>
  );
};

export default StudentLayout;
