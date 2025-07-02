import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Force clear any false profile data on app startup
const clearFalseProfiles = () => {
  const keysToRemove = [
    'teacherProfileData',
    'teacherProfilePublished', 
    'schoolProfileData',
    'schoolProfilePublished',
    'publishedTeachers',
    'publishedSchools',
    'allPublishedSchools',
    'allPublishedTeachers'
  ];

  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });

  // Also remove any keys containing suspicious data
  Object.keys(localStorage).forEach(key => {
    const data = localStorage.getItem(key);
    if (data && (
      data.includes('Aydin') || 
      data.includes('Gasymov') || 
      data.includes('ILIM') || 
      data.includes('Илим') ||
      data.includes('kjnio') ||
      data.includes('Columbia')
    )) {
      localStorage.removeItem(key);
    }
  });
};

clearFalseProfiles();

createRoot(document.getElementById("root")!).render(<App />);
