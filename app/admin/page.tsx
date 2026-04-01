'use client';

import dynamic from 'next/dynamic';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useAdminData } from './_hooks/useAdminData';
import { useQbank } from './_hooks/useQbank';
import { useApproach } from './_hooks/useApproach';
import { useExamForm } from './_hooks/useExamForm';

// Lazy load tab components — only the active tab gets loaded
const UsersTab = dynamic(() => import('./_components/UsersTab'));
const ExamsTab = dynamic(() => import('./_components/ExamsTab'));
const CodesTab = dynamic(() => import('./_components/CodesTab'));
const QbankTab = dynamic(() => import('./_components/QbankTab'));
const ApproachTab = dynamic(() => import('./_components/ApproachTab'));
const EditUserModal = dynamic(() => import('./_components/EditUserModal'));
const EditExamModal = dynamic(() => import('./_components/EditExamModal'));

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const admin = useAdminData(user, isLoading);
  const qbank = useQbank(admin.activeTab);
  const approach = useApproach(admin.activeTab);
  const examForm = useExamForm(admin.loadData, admin.setMessage, admin.setError);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !user.uniqueCode || !user.uniqueCode.startsWith('ADMIN')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600">You don't have admin privileges</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {['users', 'exams', 'codes', 'qbank', 'approach'].map((tab) => (
              <button
                key={tab}
                onClick={() => admin.setActiveTab(tab)}
                className={`py-2 px-4 border-b-2 font-medium text-sm capitalize ${
                  admin.activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab} {tab === 'users' ? `(${admin.users.length})` : tab === 'exams' ? `(${admin.exams.length})` : tab === 'codes' ? `(${admin.uniqueCodes.length})` : ''}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {admin.loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {admin.activeTab === 'users' && (
              <UsersTab
                users={admin.users}
                subscriptions={admin.subscriptions}
                setSubscriptions={admin.setSubscriptions}
                grantDuration={admin.grantDuration}
                setGrantDuration={admin.setGrantDuration}
                guestCount={admin.guestCount}
                userSearchTerm={admin.userSearchTerm}
                setUserSearchTerm={admin.setUserSearchTerm}
                setEditingUser={admin.setEditingUser}
                resetUserPassword={admin.resetUserPassword}
                unlockUserAccount={admin.unlockUserAccount}
                deleteUser={admin.deleteUser}
              />
            )}

            {admin.activeTab === 'exams' && (
              <ExamsTab
                exams={admin.exams}
                loading={admin.loading}
                message={admin.message}
                error={admin.error}
                examView={examForm.examView}
                setExamView={examForm.setExamView}
                setEditingExam={admin.setEditingExam}
                deleteExam={admin.deleteExam}
                loadData={admin.loadData}
                setMessage={admin.setMessage}
                setError={admin.setError}
                examTitle={examForm.examTitle}
                setExamTitle={examForm.setExamTitle}
                selectedSubject={examForm.selectedSubject}
                setSelectedSubject={examForm.setSelectedSubject}
                examTime={examForm.examTime}
                setExamTime={examForm.setExamTime}
                secretCode={examForm.secretCode}
                setSecretCode={examForm.setSecretCode}
                handleFileUpload={examForm.handleFileUpload}
                preview={examForm.preview}
                setPreview={examForm.setPreview}
                setFile={examForm.setFile}
                createNewExam={examForm.createNewExam}
                examFormLoading={examForm.examFormLoading}
                resetForm={examForm.resetForm}
              />
            )}

            {admin.activeTab === 'codes' && (
              <CodesTab
                uniqueCodes={admin.uniqueCodes}
                codeFilter={admin.codeFilter}
                setCodeFilter={admin.setCodeFilter}
                generateCodes={admin.generateCodes}
              />
            )}

            {admin.activeTab === 'qbank' && (
              <QbankTab
                qbankStructure={qbank.qbankStructure}
                newSubjectName={qbank.newSubjectName}
                setNewSubjectName={qbank.setNewSubjectName}
                newSourceName={qbank.newSourceName}
                setNewSourceName={qbank.setNewSourceName}
                newLectureName={qbank.newLectureName}
                setNewLectureName={qbank.setNewLectureName}
                newTopicName={qbank.newTopicName}
                setNewTopicName={qbank.setNewTopicName}
                selectedSubjectForSource={qbank.selectedSubjectForSource}
                setSelectedSubjectForSource={qbank.setSelectedSubjectForSource}
                selectedSubjectForLecture={qbank.selectedSubjectForLecture}
                setSelectedSubjectForLecture={qbank.setSelectedSubjectForLecture}
                selectedLectureForTopic={qbank.selectedLectureForTopic}
                setSelectedLectureForTopic={qbank.setSelectedLectureForTopic}
                importSubject={qbank.importSubject}
                setImportSubject={qbank.setImportSubject}
                importSource={qbank.importSource}
                setImportSource={qbank.setImportSource}
                importLecture={qbank.importLecture}
                setImportLecture={qbank.setImportLecture}
                importTopic={qbank.importTopic}
                setImportTopic={qbank.setImportTopic}
                importFile={qbank.importFile}
                setImportFile={qbank.setImportFile}
                manageSubject={qbank.manageSubject}
                setManageSubject={qbank.setManageSubject}
                questionFilterSubject={qbank.questionFilterSubject}
                setQuestionFilterSubject={qbank.setQuestionFilterSubject}
                questionFilterLecture={qbank.questionFilterLecture}
                setQuestionFilterLecture={qbank.setQuestionFilterLecture}
                questionFilterTopic={qbank.questionFilterTopic}
                setQuestionFilterTopic={qbank.setQuestionFilterTopic}
                questionFilterSource={qbank.questionFilterSource}
                setQuestionFilterSource={qbank.setQuestionFilterSource}
                filteredQuestions={qbank.filteredQuestions}
                setFilteredQuestions={qbank.setFilteredQuestions}
                csvPreview={qbank.csvPreview}
                csvPreviewCount={qbank.csvPreviewCount}
                csvPreviewQuestion={qbank.csvPreviewQuestion}
                setCsvPreview={qbank.setCsvPreview}
                setCsvPreviewCount={qbank.setCsvPreviewCount}
                addSubject={qbank.addSubject}
                addSource={qbank.addSource}
                addLecture={qbank.addLecture}
                addTopic={qbank.addTopic}
                importQuestions={qbank.importQuestions}
                deleteSource={qbank.deleteSource}
                moveLectureToTop={qbank.moveLectureToTop}
                deleteLecture={qbank.deleteLecture}
                deleteSubject={qbank.deleteSubject}
                deleteTopic={qbank.deleteTopic}
                loadFilteredQuestions={qbank.loadFilteredQuestions}
                deleteAllQuestions={qbank.deleteAllQuestions}
                updateQbankStructure={qbank.updateQbankStructure}
                handlePreviewCsvFile={qbank.handlePreviewCsvFile}
              />
            )}

            {admin.activeTab === 'approach' && (
              <ApproachTab
                approachStructure={approach.approachStructure}
                newMainFolder={approach.newMainFolder}
                setNewMainFolder={approach.setNewMainFolder}
                newSubFolder={approach.newSubFolder}
                setNewSubFolder={approach.setNewSubFolder}
                newApproachFile={approach.newApproachFile}
                setNewApproachFile={approach.setNewApproachFile}
                selectedMainFolder={approach.selectedMainFolder}
                setSelectedMainFolder={approach.setSelectedMainFolder}
                selectedSubFolder={approach.selectedSubFolder}
                setSelectedSubFolder={approach.setSelectedSubFolder}
                addMainFolder={approach.addMainFolder}
                addSubFolder={approach.addSubFolder}
                addApproachFile={approach.addApproachFile}
                deleteApproachItem={approach.deleteApproachItem}
                moveApproachItem={approach.moveApproachItem}
              />
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <EditUserModal
        editingUser={admin.editingUser}
        setEditingUser={admin.setEditingUser}
        updateUserInfo={admin.updateUserInfo}
      />
      <EditExamModal
        editingExam={admin.editingExam}
        setEditingExam={admin.setEditingExam}
        updateExamInfo={admin.updateExamInfo}
      />
    </div>
  );
}
