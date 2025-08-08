import { NextRequest, NextResponse } from 'next/server';
import { getAllExams } from '@/lib/db-utils';
import { verifyToken } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  // Check if user is authenticated (any valid user can access exams)
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
  try {
    console.log('🔄 Loading exams from database for wizary-exam page...');
    // Load exams from database
    const exams = await getAllExams();
    console.log(`📊 Found ${exams.length} exams in database`);
    
    // Subject mapping
    const subjectMapping: { [key: string]: string } = {
      'obgyn': 'Obstetric & Gynecology',
      'im': 'Internal Medicine',
      'surgery': 'Surgery',
      'pediatrics': 'Pediatric'
    };

    // Transform the data to match the expected format for wizary-exam page
    const transformedExams = exams.map((exam: any) => ({
      id: exam.id,
      name: exam.title,
      department: 'المرحلة السادسة',
      questions: JSON.parse(exam.questions).length, // Parse questions from JSON string
      time: exam.examTime || 180,
      faculty: 'كلية الطب',
      university: 'جامعة فلان',
      subject: subjectMapping[exam.subject] || 'Obstetric & Gynecology',
      order: exam.order || 999,
      secretCode: exam.secretCode || 'HaiderAlaa',
      importedData: {
        ...exam,
        questions: JSON.parse(exam.questions) // Parse questions for the exam data
      }
    }));

    // Sort exams by subject and then by order
    transformedExams.sort((a: any, b: any) => {
      if (a.subject !== b.subject) {
        return a.subject.localeCompare(b.subject);
      }
      return a.order - b.order;
    });

    console.log(`✅ Transformed ${transformedExams.length} exams for wizary-exam page`);
    return NextResponse.json({ 
      exams: transformedExams,
      message: 'Exams loaded successfully from database'
    });
    
  } catch (error) {
    console.error('Error loading exams from database:', error);
    return NextResponse.json(
      { error: 'Failed to load exams' },
      { status: 500 }
    );
  }
}