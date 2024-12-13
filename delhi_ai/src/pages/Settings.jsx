import { Card, Title, Button, Select, SelectItem, TextInput } from '@tremor/react';

function Settings() {
  return (
    <div className="space-y-6">
      {/* <Card>
        <Title>Model Configuration</Title>
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Update Frequency</label>
            <Select className="mt-1">
              <SelectItem value="5min">Every 5 minutes</SelectItem>
              <SelectItem value="15min">Every 15 minutes</SelectItem>
              <SelectItem value="30min">Every 30 minutes</SelectItem>
              <SelectItem value="1hour">Hourly</SelectItem>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Data Retention Period</label>
            <Select className="mt-1">
              <SelectItem value="1month">1 Month</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">API Key</label>
            <TextInput type="password" placeholder="Enter API Key" className="mt-1" />
          </div>

          <Button size="lg" color="blue">
            Save Changes
          </Button>
        </div>
      </Card> */}

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
            <TextInput type="email" placeholder="Enter email address" className="mt-1" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <TextInput type="tel" placeholder="Enter phone number" className="mt-1" />
          </div>

          <Button size="lg" color="blue">
            Update Notifications
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default Settings;