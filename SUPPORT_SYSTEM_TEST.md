# Support System Test Guide

## 🧪 Testing the Support System Connection

### **Step 1: Submit a Support Request**
1. Go to the public support page: `http://localhost:8081/support`
2. Fill out the contact form:
   - **Name:** Test User
   - **Email:** test@example.com
   - **Subject:** Test Support Request
   - **Message:** This is a test message to verify the system is working
3. Click "Send Message"
4. You should see a success toast message

### **Step 2: Check Admin Panel**
1. Go to admin login: `http://localhost:8081/admin/login`
2. Login with admin credentials
3. Check the "Support Requests" card - it should show count > 0
4. Click "View Requests" button
5. You should see the Support Management tab with your test request

### **Step 3: Use Test Component (Debugging)**
1. In the admin dashboard, go to the "Support" tab
2. You'll see a "Support System Test" component at the top
3. Use the buttons to:
   - **Create Test Request:** Creates a test request programmatically
   - **Show Current Requests:** Logs current requests to console
   - **Clear All Requests:** Removes all requests from localStorage

### **Step 4: Verify Request Details**
1. In the Support Management tab, click the 👁️ (Eye) button on any request
2. You should see the full request details in a modal
3. Test the email response system by sending a reply

## 🔧 Troubleshooting

### **If requests don't appear:**
1. Check browser console for errors
2. Verify localStorage has data: `localStorage.getItem('support_requests')`
3. Use the test component to create a test request
4. Check if the admin stats are updating

### **If form submission fails:**
1. Check browser console for error messages
2. Verify all form fields are filled
3. Check network tab for any failed requests

### **If admin panel shows 0 requests:**
1. Use the test component to create a request
2. Check if the stats are being calculated correctly
3. Verify the localStorage data is being read properly

## 📊 Expected Behavior

- **Public Form:** Should submit requests and show success message
- **Admin Dashboard:** Should show request count in Support Requests card
- **Support Management:** Should display all submitted requests in a table
- **Request Details:** Should show full request information in modal
- **Email System:** Should allow sending responses to users

## 🗂️ Data Storage

All support requests are currently stored in `localStorage` under the key `support_requests`. In production, this would be replaced with a real database table.

## 🔄 Real-time Updates

The system should update in real-time:
- Request count updates automatically
- New requests appear immediately in admin panel
- Status changes are reflected instantly 