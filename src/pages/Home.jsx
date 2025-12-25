import { faChalkboardTeacher, faClipboard, faDice, faGamepad, faPaperPlane, faPuzzlePiece, faQuestionCircle, faShield } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../authContext'
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { QuizCard, QuizSkeleton } from '../components/QuizCard';
import MenuNavbar from '../components/MenuNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

export default function Home() 
{
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();
  useEffect(() => 
  {
    async function fetchLatestQuizzes() 
    {
      const { data, error } = await supabase.from('quizzes').select().order('created_at', { ascending: false }).limit(15);
      if (!error) 
      {
        setQuizzes(data)
        setIsLoading(false)
      }
    }

    const timeoutId = setTimeout(fetchLatestQuizzes, 1000)
    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <div className='dark:bg-dark-primary bg-light-primary min-h-[100vh]'>
      <MenuNavbar showSearchBtn={true} />
      <Section navigate={navigate} heading={user.user_metadata.name ? `Hiya, ${user.user_metadata.name.split(' ')[0]}` : `Welcome back`} subheading={'What to learn today?'} isLoading={isLoading} quizzes={quizzes} />
    </div>
  );
}

function Section({ navigate,heading, subheading, isLoading, quizzes})
{
  const { user } = useAuth();
  const navigateToAiQuiz = () => navigate('/ai-quiz');
  const navigateToGames = () => navigate('/games');

  const LoadingSkeletons = () => [...Array(15)].map((_, index) => <QuizSkeleton key={index} url="fallback.png" setIsCardLoaded={() => { }} />)
  const Quizzes = (array) => array.map((quiz, index) => <QuizCard key={index} quiz={quiz} user={user} />);

  function Results()
  { 
    return isLoading ? <LoadingSkeletons/> : Quizzes(quizzes);
  }

  return (
    <div className='p-20 px-2 sm:px-15'>
      {heading.length > 0 && <h2 className='px-2 md:px-4 md:text-2xl dark:text-light-primary font-extrabold text-xl'>{heading}</h2>}
      {subheading.length > 0 && <p className='px-2 md:px-4 md:text-lg dark:text-light-primary text-sm'>{subheading}</p>}
      <FeaturedSection navigateToAiQuiz={navigateToAiQuiz} navigateToGames={navigateToGames}/>
      <div className="w-full bg-primary-secondary grid grid-cols-1 min-[450px]:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1 pt-3 md:p-4">
        <Results/>
      </div>
    </div>
  );
}

function FeaturedSection({navigateToAiQuiz,navigateToGames})
{
  return (
    <div className="flex items-center flex-col md:flex-row md:mx-4 mx-1 mt-4 mb-2 gap-2">
      <div className='w-full h-26 md:h-42 rounded-lg items-center flex bg-gradient-to-b from-accent-one to-blue-700'>
        <div className='flex-grow px-12 flex-2/3 relative h-full flex justify-center flex-col overflow-hidden' onClick={navigateToAiQuiz}>
          <h2 className='text-lg md:text-4xl font-extrabold text-white'>Try Quizy AI</h2>
          <h2 className='text-xs md:text-lg font-normal text-gray-300'>Create quizzes in few clicks</h2>
          <FontAwesomeIcon icon={faClipboard} className="text-8xl rotate-[14deg] text-blue-300 absolute -bottom-0 right-4 opacity-50" />
          <FontAwesomeIcon icon={faQuestionCircle} className="text-7xl text-blue-300 absolute bottom-12 right-45 opacity-50" />
          <FontAwesomeIcon icon={faChalkboardTeacher} className="text-8xl -rotate-[16deg] text-blue-300 absolute bottom-17 right-15 opacity-50" />
        </div>
      </div>
    </div>
  )
}

