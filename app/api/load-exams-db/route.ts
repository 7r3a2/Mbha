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
    
    if (exams.length === 0) {
      console.log('⚠️ No exams found in database');
      return NextResponse.json({ 
        exams: [],
        message: 'No exams found in database'
      });
    }
    
    // Subject mapping
    const subjectMapping: { [key: string]: string } = {
      'obgyn': 'Obstetric & Gynecology',
      'im': 'Internal Medicine',
      'surgery': 'Surgery',
      'pediatrics': 'Pediatric'
    };

    // Transform the data to match the expected format for wizary-exam page
    const transformedExams = exams.map((exam: any) => {
      try {
        // Parse questions safely
        let questionsArray = [];
        let questionCount = 0;
        
        if (exam.questions) {
          if (typeof exam.questions === 'string') {
            questionsArray = JSON.parse(exam.questions);
          } else if (Array.isArray(exam.questions)) {
            questionsArray = exam.questions;
          }
          questionCount = Array.isArray(questionsArray) ? questionsArray.length : 0;
        }
        
        return {
          id: exam.id,
          name: exam.title || 'Untitled Exam',
          department: 'المرحلة السادسة',
          questions: questionCount,
          time: exam.examTime || 180,
          faculty: 'كلية الطب',
          university: 'جامعة فلان',
          subject: subjectMapping[exam.subject] || exam.subject || 'Obstetric & Gynecology',
          order: exam.order || 999,
          secretCode: exam.secretCode || 'HaiderAlaa',
          importedData: {
            ...exam,
            questions: questionsArray
          }
        };
      } catch (parseError) {
        console.error(`❌ Error parsing exam ${exam.id}:`, parseError);
        // Return a basic exam structure even if parsing fails
        return {
          id: exam.id,
          name: exam.title || 'Untitled Exam',
          department: 'المرحلة السادسة',
          questions: 0,
          time: exam.examTime || 180,
          faculty: 'كلية الطب',
          university: 'جامعة فلان',
          subject: subjectMapping[exam.subject] || exam.subject || 'Obstetric & Gynecology',
          order: exam.order || 999,
          secretCode: exam.secretCode || 'HaiderAlaa',
          importedData: {
            ...exam,
            questions: []
          }
        };
      }
    });

    // Sort exams by subject and then by order
    transformedExams.sort((a: any, b: any) => {
      if (a.subject !== b.subject) {
        return a.subject.localeCompare(b.subject);
      }
      return (a.order || 999) - (b.order || 999);
    });

    console.log(`✅ Transformed ${transformedExams.length} exams for wizary-exam page`);
    console.log('📋 Sample exam:', transformedExams[0]);
    
    return NextResponse.json({ 
      exams: transformedExams,
      message: 'Exams loaded successfully from database'
    });
    
  } catch (error: any) {
    console.error('💥 Error loading exams from database:', error);
    console.error('💥 Error stack:', error.stack);
    return NextResponse.json(
      { 
        error: 'Failed to load exams',
        details: error.message,
        exams: []
      },
      { status: 500 }
    );
  }
}