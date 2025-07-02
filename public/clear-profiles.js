// Clear localStorage script to run in browser console
console.log('Clearing all teacher and school profile data...');

// List of all possible localStorage keys
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

// Remove all keys
keysToRemove.forEach(key => {
  if (localStorage.getItem(key)) {
    console.log(`Removing ${key}:`, localStorage.getItem(key));
    localStorage.removeItem(key);
  }
});

// Check for any remaining suspicious data
Object.keys(localStorage).forEach(key => {
  const data = localStorage.getItem(key);
  if (data && (
    data.includes('Aydin') || 
    data.includes('Gasymov') || 
    data.includes('ILIM') || 
    data.includes('Илим') ||
    data.includes('Columbia') ||
    data.includes('Azerbaijan') ||
    data.includes('SAT')
  )) {
    console.log(`Removing suspicious data in ${key}:`, data);
    localStorage.removeItem(key);
  }
});

console.log('All false profile data cleared!');
window.location.reload();