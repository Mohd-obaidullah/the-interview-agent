import React, { createContext, useContext, useState } from 'react';

const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {
  const [activeInterview, setActiveInterview] = useState(null);
  const [lastReport, setLastReport] = useState(null);
  const [resumeData, setResumeData] = useState(null);

  return (
    <InterviewContext.Provider value={{
      activeInterview,
      setActiveInterview,
      lastReport,
      setLastReport,
      resumeData,
      setResumeData
    }}>
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => useContext(InterviewContext);
