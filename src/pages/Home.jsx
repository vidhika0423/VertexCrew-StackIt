import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import { useUser, SignInButton, SignedOut, SignedIn, UserButton } from "@clerk/clerk-react";
import AskQuestionModal from "../components/AskQuestionModal/AskQuestionModal";
import QuestionCard from "../components/QuestionCard/QuestionCard";
import PostModal from "../components/PostModal";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import dataService from "../services/dataService";
import Pagination from '../components/Pagination';
import ErrorBoundary from '../components/ErrorBoundary';

const Home = () => {
  const { user, isLoaded } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    timeFilter: 'all',
    sortBy: 'newest',
    unansweredOnly: false
  });
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    performSearchAndFilter();
  }, [searchQuery, filters, questions]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const questionsData = await dataService.getQuestions();
      setQuestions(questionsData);
      setFilteredQuestions(questionsData);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const performSearchAndFilter = async () => {
    try {
      setLoading(true);
      const results = await dataService.searchAndFilterQuestions(searchQuery, filters);
      setFilteredQuestions(results);
    } catch (error) {
      console.error('Error searching and filtering questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleAskQuestionClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleQuestionSubmitted = async (questionData) => {
    try {
      const newQuestion = await dataService.addQuestion({
        ...questionData,
        author: user.username || user.emailAddresses[0].emailAddress,
        authorName: user.fullName || user.username || user.emailAddresses[0].emailAddress,
        tags: questionData.tags ? questionData.tags.split(',').map(tag => tag.trim()) : []
      });
      
      // Reload questions to show the new one
      await loadQuestions();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error submitting question:', error);
      alert('Failed to submit question. Please try again.');
    }
  };

  const handleVote = async (questionId, voteChange) => {
    try {
      await dataService.updateQuestionVotes(questionId, voteChange);
      await loadQuestions();
    } catch (error) {
      alert('Failed to vote. Please try again.');
    }
  };

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
    setIsPostModalOpen(true);
  };

  const handleClosePostModal = () => {
    setIsPostModalOpen(false);
    setSelectedQuestion(null);
  };

  const getFilterDescription = () => {
    const parts = [];
    
    if (searchQuery) {
      parts.push(`"${searchQuery}"`);
    }
    
    if (filters.timeFilter !== 'all') {
      const timeLabels = {
        '24h': 'last 24 hours',
        'week': 'last week',
        'month': 'last month',
        'year': 'last year'
      };
      parts.push(timeLabels[filters.timeFilter]);
    }
    
    if (filters.unansweredOnly) {
      parts.push('unanswered only');
    }
    
    if (filters.sortBy !== 'newest') {
      const sortLabels = {
        'oldest': 'oldest first',
        'most_voted': 'most voted',
        'least_voted': 'least voted'
      };
      parts.push(sortLabels[filters.sortBy]);
    }
    
    return parts.length > 0 ? parts.join(', ') : null;
  };

  // Calculate paginated questions
  const indexOfLast = currentPage * questionsPerPage;
  const indexOfFirst = indexOfLast - questionsPerPage;
  const paginatedQuestions = filteredQuestions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.container}>
      {/* Top right buttons */}
      <div className={styles.topRightButtons}>
        {isLoaded && user ? (
          <>
            <button 
              className={styles.topRightButton}
              onClick={handleAskQuestionClick}
            >
              Ask Question
            </button>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: styles.userButton
                }
              }}
            />
          </>
        ) : (
          <SignInButton mode="modal">
            <button className={styles.signInButton}>
              Sign In
            </button>
          </SignInButton>
        )}
      </div>

      <h1 className={styles.heading}>StackIt</h1>

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Filter Bar */}
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />

      {/* Content for all users */}
      <div className={styles.content}>
        {isLoaded && user ? (
          <p className={styles.subtext}>
            Hello, {user.fullName || user.username} 👋
          </p>
        ) : (
          <p className={styles.subtext}>Welcome to StackIt! Sign in to ask questions and leave comments.</p>
        )}
        
        {loading ? (
          <div className={styles.loading}>
            <p>Loading questions...</p>
          </div>
        ) : (
          <div className={styles.questionsList}>
            {(searchQuery || filters.timeFilter !== 'all' || filters.unansweredOnly || filters.sortBy !== 'newest') && (
              <div className={styles.searchResults}>
                <p>
                  {getFilterDescription() 
                    ? `Results: ${getFilterDescription()} (${filteredQuestions.length} questions found)`
                    : `${filteredQuestions.length} questions found`
                  }
                </p>
              </div>
            )}
            {paginatedQuestions.length === 0 ? (
              <div className={styles.emptyState}>
                <p>
                  {searchQuery || filters.timeFilter !== 'all' || filters.unansweredOnly
                    ? `No questions found matching your criteria. Try adjusting your search or filters.`
                    : 'No questions yet. Be the first to ask a question!'
                  }
                </p>
              </div>
            ) : (
              <ErrorBoundary>
                {paginatedQuestions.map((question) => (
                  <div key={question.id}>
                    <QuestionCard 
                      question={question} 
                      onVote={handleVote} 
                      onTitleClick={() => handleQuestionClick(question)}
                      user={user}
                      isSignedIn={isLoaded && user}
                    />
                  </div>
                ))}
              </ErrorBoundary>
            )}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Ask Question Modal - Only show if user is signed in */}
      {isLoaded && user && (
        <AskQuestionModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal}
          onSubmit={handleQuestionSubmitted}
        />
      )}
      <PostModal
        question={selectedQuestion}
        isOpen={isPostModalOpen}
        onClose={handleClosePostModal}
        user={user}
      />
    </div>
  );
};

export default Home;
