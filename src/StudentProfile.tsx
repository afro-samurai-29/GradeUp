import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import StudentLayout from '@/components/StudentLayout';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  BookOpen,
  Target,
  Calendar,
  MapPin,
  Edit,
  Save,
  X,
  Plus
} from 'lucide-react';

const StudentProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    subjects: [] as string[],
    studyGoals: '',
    examYear: '2024',
    examCenter: ''
  });
  const [loading, setLoading] = useState<boolean>(true);

  const [editForm, setEditForm] = useState(profile);

  const allSubjects = [
    'Mathematics',
    'English',
    'Afrikaans',
    'Physical Sciences',
    'Life Sciences',
    'History',
    'Geography',
    'Business Studies',
    'Economics',
    'Accounting',
    'Information Technology'
  ];

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setLoading(false);
          return;
        }
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as any;
          const loaded = {
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || user.email || '',
            phone: data.phoneNumber || '',
            dateOfBirth: data.dateOfBirth || '',
            address: data.address?.city ? `${data.address.city}, ${data.address.province || ''}`.trim() : (data.address || ''),
            subjects: data.subjects || [],
            studyGoals: data.studyGoals || '',
            examYear: data.examYear || '2024',
            examCenter: data.examCenter || '',
          };
          setProfile(loaded);
          setEditForm(loaded);
        } else {
          // create a placeholder profile
          const seed = {
            firstName: '',
            lastName: '',
            email: user.email || '',
            phoneNumber: '',
            dateOfBirth: '',
            address: '',
            subjects: [],
            studyGoals: '',
            examYear: '2024',
            examCenter: '',
            role: 'student',
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          await setDoc(ref, seed);
          setProfile({
            firstName: '',
            lastName: '',
            email: user.email || '',
            phone: '',
            dateOfBirth: '',
            address: '',
            subjects: [],
            studyGoals: '',
            examYear: '2024',
            examCenter: '',
          });
          setEditForm({
            firstName: '',
            lastName: '',
            email: user.email || '',
            phone: '',
            dateOfBirth: '',
            address: '',
            subjects: [],
            studyGoals: '',
            examYear: '2024',
            examCenter: '',
          });
        }
      } catch (e) {
        console.error('Failed to load profile:', e);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const ref = doc(db, 'users', user.uid);
      await updateDoc(ref, {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
        phoneNumber: editForm.phone,
        dateOfBirth: editForm.dateOfBirth,
        address: editForm.address,
        subjects: editForm.subjects,
        studyGoals: editForm.studyGoals,
        examYear: editForm.examYear,
        examCenter: editForm.examCenter,
        updatedAt: new Date(),
      });
      setProfile(editForm);
      setIsEditing(false);
    } catch (e) {
      console.error('Failed to save profile:', e);
    }
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  const addSubject = (subject: string) => {
    if (!editForm.subjects.includes(subject)) {
      setEditForm({
        ...editForm,
        subjects: [...editForm.subjects, subject]
      });
    }
  };

  const removeSubject = (subject: string) => {
    setEditForm({
      ...editForm,
      subjects: editForm.subjects.filter(s => s !== subject)
    });
  };

  return (
    <StudentLayout>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/student" className="hover:bg-purple-700 p-2 rounded-lg transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-purple-100">Manage your personal information and study preferences</p>
            </div>
          </div>
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-white text-purple-600 hover:bg-purple-50"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="text-white border-white hover:bg-purple-700"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {loading && (
          <Card>
            <CardContent className="py-12 text-center">Loading profile…</CardContent>
          </Card>
        )}
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                {isEditing ? (
                  <Input
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                  />
                ) : (
                  <p className="p-2 bg-gray-50 rounded">{profile.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                {isEditing ? (
                  <Input
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                  />
                ) : (
                  <p className="p-2 bg-gray-50 rounded">{profile.lastName}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                ) : (
                  <p className="p-2 bg-gray-50 rounded flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    {profile.email}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                {isEditing ? (
                  <Input
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  />
                ) : (
                  <p className="p-2 bg-gray-50 rounded flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    {profile.phone}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={editForm.dateOfBirth}
                    onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                  />
                ) : (
                  <p className="p-2 bg-gray-50 rounded flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    {new Date(profile.dateOfBirth).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                {isEditing ? (
                  <Input
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  />
                ) : (
                  <p className="p-2 bg-gray-50 rounded flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    {profile.address}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subjects Enrolled */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Subjects Enrolled ({isEditing ? editForm.subjects.length : profile.subjects.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {editForm.subjects.map((subject) => (
                    <Badge key={subject} variant="default" className="flex items-center gap-1">
                      {subject}
                      <button
                        onClick={() => removeSubject(subject)}
                        className="ml-1 hover:bg-red-600 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-2">Add subjects:</p>
                  <div className="flex flex-wrap gap-2">
                    {allSubjects
                      .filter(subject => !editForm.subjects.includes(subject))
                      .map((subject) => (
                        <Badge
                          key={subject}
                          variant="outline"
                          className="cursor-pointer hover:bg-purple-50"
                          onClick={() => addSubject(subject)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          {subject}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.subjects.map((subject) => (
                  <Badge key={subject} variant="default">
                    {subject}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Study Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Study Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={editForm.studyGoals}
                onChange={(e) => setEditForm({ ...editForm, studyGoals: e.target.value })}
                rows={4}
                placeholder="Describe your study goals and what you hope to achieve..."
              />
            ) : (
              <p className="p-4 bg-gray-50 rounded">{profile.studyGoals}</p>
            )}
          </CardContent>
        </Card>

        {/* Exam Information */}
        <Card>
          <CardHeader>
            <CardTitle>Exam Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Exam Year</label>
                {isEditing ? (
                  <select
                    value={editForm.examYear}
                    onChange={(e) => setEditForm({ ...editForm, examYear: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                  </select>
                ) : (
                  <p className="p-2 bg-gray-50 rounded">{profile.examYear}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Exam Center</label>
                {isEditing ? (
                  <Input
                    value={editForm.examCenter}
                    onChange={(e) => setEditForm({ ...editForm, examCenter: e.target.value })}
                  />
                ) : (
                  <p className="p-2 bg-gray-50 rounded">{profile.examCenter}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
};

export default StudentProfile;