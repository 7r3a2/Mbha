'use client';

interface EditUserModalProps {
  editingUser: any;
  setEditingUser: (u: any) => void;
  updateUserInfo: (userId: string, userData: any) => void;
}

export default function EditUserModal({ editingUser, setEditingUser, updateUserInfo }: EditUserModalProps) {
  if (!editingUser) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md">
        <h3 className="text-lg font-semibold mb-4">Edit User</h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          updateUserInfo(editingUser.id, {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            gender: formData.get('gender'),
            university: formData.get('university'),
            hasWizaryExamAccess: true,
            hasApproachAccess: formData.get('hasApproachAccess') === 'on',
            hasQbankAccess: formData.get('hasQbankAccess') === 'on',
            hasCoursesAccess: formData.get('hasCoursesAccess') === 'on',
          });
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input name="firstName" type="text" defaultValue={editingUser.firstName}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input name="lastName" type="text" defaultValue={editingUser.lastName}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input name="email" type="email" defaultValue={editingUser.email}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <input name="gender" type="text" defaultValue={editingUser.gender || ''}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">University</label>
              <input name="university" type="text" defaultValue={editingUser.university || ''}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black" />
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Access Permissions</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-green-100 border border-green-400 rounded flex items-center justify-center">
                    <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <label className="ml-2 text-sm text-gray-700 font-medium">Wizary Exam Access (Always Enabled)</label>
                </div>
                <div className="flex items-center">
                  <input name="hasApproachAccess" type="checkbox" defaultChecked={editingUser.hasApproachAccess}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label className="ml-2 text-sm text-gray-700">Approach Access</label>
                </div>
                <div className="flex items-center">
                  <input name="hasQbankAccess" type="checkbox" defaultChecked={editingUser.hasQbankAccess}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label className="ml-2 text-sm text-gray-700">Qbank Access</label>
                </div>
                <div className="flex items-center">
                  <input name="hasCoursesAccess" type="checkbox" defaultChecked={editingUser.hasCoursesAccess}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label className="ml-2 text-sm text-gray-700">Courses Access</label>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button type="button" onClick={() => setEditingUser(null)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
