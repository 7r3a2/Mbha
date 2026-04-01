'use client';

interface EditExamModalProps {
  editingExam: any;
  setEditingExam: (e: any) => void;
  updateExamInfo: (examId: string, examData: any) => void;
}

export default function EditExamModal({ editingExam, setEditingExam, updateExamInfo }: EditExamModalProps) {
  if (!editingExam) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md">
        <h3 className="text-lg font-semibold mb-4">Edit Exam</h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          updateExamInfo(editingExam.id, {
            title: formData.get('title'),
            subject: formData.get('subject'),
            examTime: Number(formData.get('examTime')),
            secretCode: formData.get('secretCode'),
            order: Number(formData.get('order')),
          });
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input name="title" type="text" defaultValue={editingExam.title}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <select name="subject" defaultValue={editingExam.subject}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black" required>
                <option value="obgyn">Obstetric & Gynecology</option>
                <option value="im">Internal Medicine</option>
                <option value="surgery">Surgery</option>
                <option value="pediatrics">Pediatrics</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Exam Time (minutes)</label>
              <input name="examTime" type="number" defaultValue={editingExam.examTime}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Secret Code</label>
              <input name="secretCode" type="text" defaultValue={editingExam.secretCode}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Order</label>
              <input name="order" type="number" defaultValue={editingExam.order}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black" />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button type="button" onClick={() => setEditingExam(null)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
