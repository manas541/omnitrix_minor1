import { Card, Title, Button, Select, SelectItem, TextInput } from '@tremor/react';
import { useState } from 'react';

function Settings() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdateNotifications = () => {
    if (!email.trim() || !phone.trim()) {
      setMessage('Required fields are empty');
    } else {
      setMessage('Message has been sent');
      setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <Title>Notification Settings</Title>
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border-gray-300" />
              <span>Email Alerts for Peak Load</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border-gray-300" />
              <span>SMS Notifications</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border-gray-300" />
              <span>Daily Report Summary</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <TextInput
              type="email"
              placeholder="Enter email address"
              className="mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <TextInput
              type="tel"
              placeholder="Enter phone number"
              className="mt-1"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <Button size="lg" color="blue" onClick={handleUpdateNotifications}>
            Update Notifications
          </Button>

          {message && (
            <div className={`mt-4 font-semibold ${message === 'Required fields are empty' ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default Settings;
