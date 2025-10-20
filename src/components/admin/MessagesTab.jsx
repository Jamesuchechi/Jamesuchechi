'use client';
import { useState, useEffect } from 'react';

export default function MessagesTab() {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/contact-messages');
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const res = await fetch(`/api/contact-messages/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete message');
      
      await fetchMessages();
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      alert('Message deleted successfully!');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-gray-600">Loading messages...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Contact Messages</h2>
        <p className="text-gray-600">View and manage contact form submissions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Messages List */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-xl font-bold mb-4">All Messages ({messages.length})</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedMessage?.id === message.id
                    ? 'border-black bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold">{message.name}</h4>
                    <p className="text-sm text-gray-600">{message.email}</p>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {message.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {formatDate(message.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(message.id);
                    }}
                    className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <p className="text-gray-500 text-center py-8">No messages yet.</p>
            )}
          </div>
        </div>

        {/* Message Details */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-xl font-bold mb-4">Message Details</h3>
          {selectedMessage ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p className="text-gray-900">{selectedMessage.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">
                  <a 
                    href={`mailto:${selectedMessage.email}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {selectedMessage.email}
                  </a>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <p className="text-gray-900">{formatDate(selectedMessage.createdAt)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: Your message from portfolio contact form`}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-center"
                >
                  Reply via Email
                </a>
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Select a message to view details
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
