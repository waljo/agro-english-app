import React, { useState, useEffect } from 'react';

// Dados de amostra para maquinario agricola (sem acentos)
const machineryData = [
  {
    id: 1,
    namePt: "Trator",
    nameEn: "Tractor",
    description: "Veiculo utilizado para puxar ou empurrar implementos agricolas.",
    example: "The farmer needs a new tractor for the upcoming harvest season.",
    imageUrl: "https://i.imgur.com/xzTHzK8.jpg",
    difficulty: "easy",
    category: "basic",
  },
  {
    id: 2,
    namePt: "Colheitadeira",
    nameEn: "Harvester",
    description: "Maquina utilizada para colher graos como soja, milho e trigo.",
    example: "The harvester can process up to 30 acres of soybeans per day.",
    imageUrl: "https://i.imgur.com/BOsLOAr.jpg",
    difficulty: "medium",
    category: "harvest",
  },
  {
    id: 3,
    namePt: "Pulverizador",
    nameEn: "Sprayer",
    description: "Equipamento usado para aplicacao de defensivos agricolas e fertilizantes liquidos.",
    example: "The sprayer needs to be calibrated before applying the pesticide.",
    imageUrl: "https://i.imgur.com/uv5Y4B7.jpg",
    difficulty: "medium",
    category: "protection",
  },
  {
    id: 4,
    namePt: "Plantadeira",
    nameEn: "Planter",
    description: "Maquina utilizada para o plantio de sementes no solo.",
    example: "The new planter allows for more precise seed placement.",
    imageUrl: "https://i.imgur.com/N8Crfj4.jpg",
    difficulty: "medium",
    category: "planting",
  },
  {
    id: 5,
    namePt: "Semeadora",
    nameEn: "Seeder",
    description: "Equipamento que distribui sementes no solo de forma precisa.",
    example: "He bought a new seeder with GPS technology for better accuracy.",
    imageUrl: "https://i.imgur.com/JV4j13f.jpg",
    difficulty: "medium",
    category: "planting",
  }
];

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState('learn'); // 'learn', 'quiz', 'review'
  const [favorites, setFavorites] = useState([]);
  const [mastered, setMastered] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [progress, setProgress] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizQuestion, setQuizQuestion] = useState(null);
  
  const currentItem = machineryData[currentIndex];
  
  useEffect(() => {
    // Atualiza o progresso baseado nos itens vistos e dominados
    const progressValue = (mastered.length / machineryData.length) * 100;
    setProgress(progressValue);
  }, [mastered]);
  
  // Avançar para o próximo item
  const handleNext = () => {
    if (currentIndex < machineryData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowInfo(false);
    } else if (viewMode === 'learn' && mastered.length < machineryData.length / 2) {
      // Se o usuário viu todos os itens, mas ainda não dominou metade, sugerir revisão
      startReview();
    } else if (viewMode === 'learn') {
      // Se o usuário viu todos os itens e dominou pelo menos metade, sugerir quiz
      startQuiz();
    }
  };
  
  // Retornar ao item anterior
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowInfo(false);
    }
  };
  
  // Alternar item como favorito
  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(itemId => itemId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };
  
  // Marcar item como dominado
  const toggleMastered = (id) => {
    if (mastered.includes(id)) {
      setMastered(mastered.filter(itemId => itemId !== id));
    } else {
      setMastered([...mastered, id]);
      // Simular pontuação e animação de conquista
      console.log("Achievement unlocked!");
    }
  };
  
  // Iniciar modo de revisão
  const startReview = () => {
    setViewMode('review');
    // Filtrar itens não dominados para revisão
    const notMasteredItems = machineryData.filter(item => !mastered.includes(item.id));
    if (notMasteredItems.length > 0) {
      setCurrentIndex(machineryData.indexOf(notMasteredItems[0]));
    }
  };
  
  // Iniciar modo de quiz
  const startQuiz = () => {
    setViewMode('quiz');
    generateQuizQuestion();
  };
  
  // Gerar uma pergunta de quiz
  const generateQuizQuestion = () => {
    const questionType = Math.random() > 0.5 ? 'translate' : 'match';
    const correctItem = machineryData[currentIndex];
    
    // Gera 3 opções erradas aleatórias
    let wrongOptions = machineryData
      .filter(item => item.id !== correctItem.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    // Cria um array com todas as opções e embaralha
    const allOptions = [correctItem, ...wrongOptions].sort(() => 0.5 - Math.random());
    
    if (questionType === 'translate') {
      setQuizQuestion({
        type: 'translate',
        prompt: `Como se diz "${correctItem.namePt}" em ingles?`,
        correctAnswer: correctItem.nameEn,
        options: allOptions.map(item => item.nameEn),
        itemId: correctItem.id
      });
    } else {
      setQuizQuestion({
        type: 'match',
        prompt: 'Qual maquina corresponde a esta descricao?',
        correctAnswer: correctItem.namePt,
        description: correctItem.description,
        options: allOptions.map(item => item.namePt),
        itemId: correctItem.id
      });
    }
    
    setQuizAnswers([]);
  };
  
  // Verificar resposta do quiz
  const checkAnswer = (answer) => {
    const isCorrect = answer === quizQuestion.correctAnswer;
    setQuizAnswers([...quizAnswers, { answer, isCorrect }]);
    
    if (isCorrect && !mastered.includes(quizQuestion.itemId)) {
      // Se acertou e ainda não dominava, marca como dominado
      setMastered([...mastered, quizQuestion.itemId]);
    }
    
    // Após pequeno delay, gera nova pergunta ou volta ao modo aprendizado
    setTimeout(() => {
      if (quizAnswers.length < 4) {
        // Continua o quiz se tiver respondido menos de 5 perguntas
        generateQuizQuestion();
      } else {
        // Volta para o modo aprendizado após 5 perguntas
        setViewMode('learn');
        handleNext();
      }
    }, 1500);
  };
  
  // Simular áudio de pronúncia
  const playPronunciation = () => {
    // Aqui seria implementada a reprodução de áudio
    console.log(`Playing pronunciation for: ${currentItem.nameEn}`);
  };

  // Estilos inline
  const styles = {
    appContainer: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '500px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#f8f9fa'
    },
    header: {
      background: 'linear-gradient(to right, #4CAF50, #2196F3)',
      color: 'white',
      padding: '15px',
      textAlign: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    title: {
      margin: '0 0 5px 0',
      fontSize: '24px',
      fontWeight: 'bold'
    },
    subtitle: {
      margin: '5px 0 15px 0',
      fontSize: '16px'
    },
    progressBar: {
      width: '100%',
      height: '8px',
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderRadius: '4px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#FFC107',
      width: `${progress}%`,
      transition: 'width 0.5s ease-in-out'
    },
    mainContent: {
      flex: 1,
      overflow: 'auto',
      padding: '20px',
      background: 'white'
    },
    imageContainer: {
      width: '100%',
      height: '200px',
      marginBottom: '20px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f5f5f5'
    },
    languageTag: {
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      marginBottom: '5px'
    },
    ptTag: {
      background: '#f0f0f0',
      color: '#666'
    },
    enTag: {
      background: '#e3f2fd',
      color: '#1976d2'
    },
    wordPt: {
      fontSize: '28px',
      fontWeight: 'bold',
      margin: '10px 0',
      color: '#333'
    },
    wordEn: {
      fontSize: '24px',
      fontWeight: 'bold',
      margin: '10px 0',
      color: '#1976d2'
    },
    infoContainer: {
      padding: '15px',
      margin: '15px 0',
      borderRadius: '8px',
      background: '#f5f8ff',
      border: '1px solid #d0e1fd'
    },
    example: {
      fontStyle: 'italic',
      marginBottom: '10px'
    },
    description: {
      fontSize: '14px',
      color: '#666'
    },
    buttonsContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '20px'
    },
    actionButton: {
      border: 'none',
      borderRadius: '8px',
      padding: '10px 15px',
      margin: '0 5px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    primaryButton: {
      backgroundColor: '#2196F3',
      color: 'white'
    },
    secondaryButton: {
      backgroundColor: '#f0f0f0',
      color: '#666'
    },
    favoriteButton: {
      backgroundColor: favorites.includes(currentItem?.id) ? '#fff9c4' : '#f0f0f0',
      color: favorites.includes(currentItem?.id) ? '#ffa000' : '#666'
    },
    masteredButton: {
      backgroundColor: mastered.includes(currentItem?.id) ? '#e8f5e9' : '#f0f0f0',
      color: mastered.includes(currentItem?.id) ? '#388e3c' : '#666'
    },
    infoButton: {
      backgroundColor: showInfo ? '#e3f2fd' : '#f0f0f0',
      color: showInfo ? '#1976d2' : '#666'
    },
    navigationBar: {
      display: 'flex',
      justifyContent: 'space-around',
      padding: '10px',
      backgroundColor: 'white',
      borderTop: '1px solid #e0e0e0'
    },
    navButton: {
      padding: '10px 15px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      backgroundColor: 'transparent',
      fontSize: '14px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    activeNavButton: {
      backgroundColor: '#e3f2fd',
      color: '#1976d2'
    },
    quizContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    quizPrompt: {
      fontSize: '18px',
      fontWeight: 'bold',
      textAlign: 'center',
      margin: '20px 0'
    },
    quizDescription: {
      fontStyle: 'italic',
      margin: '0 0 20px 0',
      padding: '10px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      width: '100%',
      textAlign: 'center'
    },
    quizOptionsContainer: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px',
      width: '100%'
    },
    quizOption: {
      padding: '15px',
      textAlign: 'center',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      backgroundColor: 'white',
      cursor: 'pointer'
    },
    correctOption: {
      backgroundColor: '#e8f5e9',
      borderColor: '#4caf50',
      color: '#2e7d32'
    },
    incorrectOption: {
      backgroundColor: '#ffebee',
      borderColor: '#f44336',
      color: '#c62828'
    }
  };
  
  // Renderiza o conteúdo com base no modo de visualização
  const renderContent = () => {
    if (viewMode === 'learn' || viewMode === 'review') {
      return (
        <div style={{ textAlign: 'center' }}>
          {/* Imagem da máquina */}
          <div style={styles.imageContainer}>
            <img 
              src={currentItem.imageUrl}
              alt={currentItem.namePt} 
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          </div>
          
          {/* Termos em português e inglês */}
          <div>
            <span style={{...styles.languageTag, ...styles.ptTag}}>Portugues</span>
            <h2 style={styles.wordPt}>{currentItem.namePt}</h2>
            
            <span style={{...styles.languageTag, ...styles.enTag}}>English</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <h3 style={styles.wordEn}>{currentItem.nameEn}</h3>
              <button 
                onClick={playPronunciation} 
                style={{ 
                  marginLeft: '10px', 
                  border: 'none', 
                  borderRadius: '50%', 
                  width: '40px', 
                  height: '40px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: '#e3f2fd'
                }}
              >
                Som
              </button>
            </div>
          </div>
          
          {/* Exemplo de uso */}
          {showInfo && (
            <div style={styles.infoContainer}>
              <p style={styles.example}>"{currentItem.example}"</p>
              <p style={styles.description}>{currentItem.description}</p>
            </div>
          )}
          
          {/* Botões de ação */}
          <div style={styles.buttonsContainer}>
            <div style={{ display: 'flex' }}>
              <button 
                onClick={() => toggleFavorite(currentItem.id)} 
                style={{...styles.actionButton, ...styles.favoriteButton}}
              >
                Fav
              </button>
              <button 
                onClick={() => toggleMastered(currentItem.id)} 
                style={{...styles.actionButton, ...styles.masteredButton}}
              >
                OK
              </button>
              <button 
                onClick={() => setShowInfo(!showInfo)} 
                style={{...styles.actionButton, ...styles.infoButton}}
              >
                Info
              </button>
            </div>
            
            <div style={{ display: 'flex' }}>
              <button 
                onClick={handlePrevious} 
                style={{...styles.actionButton, ...styles.secondaryButton}}
                disabled={currentIndex === 0}
              >
                &lt;
              </button>
              <button 
                onClick={handleNext} 
                style={{...styles.actionButton, ...styles.primaryButton}}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      );
    } else if (viewMode === 'quiz') {
      return (
        <div style={styles.quizContainer}>
          <h2 style={styles.quizPrompt}>{quizQuestion?.prompt}</h2>
          
          {quizQuestion?.type === 'match' && (
            <p style={styles.quizDescription}>"{quizQuestion.description}"</p>
          )}
          
          <div style={styles.quizOptionsContainer}>
            {quizQuestion?.options.map((option, index) => {
              const hasAnswered = quizAnswers.some(a => a.answer === option);
              const isCorrect = hasAnswered && quizAnswers.find(a => a.answer === option).isCorrect;
              
              let optionStyle = {...styles.quizOption};
              if (hasAnswered) {
                if (isCorrect) {
                  optionStyle = {...optionStyle, ...styles.correctOption};
                } else {
                  optionStyle = {...optionStyle, ...styles.incorrectOption};
                }
              }
              
              return (
                <button
                  key={index}
                  onClick={() => !hasAnswered && checkAnswer(option)}
                  style={optionStyle}
                  disabled={hasAnswered}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      );
    }
  };
  
  return (
    <div style={styles.appContainer}>
      {/* Cabeçalho */}
      <header style={styles.header}>
        <h1 style={styles.title}>AgroEnglish</h1>
        <h2 style={styles.subtitle}>Modulo 1: Maquinario Agricola</h2>
        
        {/* Barra de progresso */}
        <div style={styles.progressBar}>
          <div style={styles.progressFill}></div>
        </div>
      </header>
      
      {/* Conteúdo principal */}
      <main style={styles.mainContent}>
        {renderContent()}
      </main>
      
      {/* Barra de navegação inferior */}
      <nav style={styles.navigationBar}>
        <button 
          onClick={() => setViewMode('learn')} 
          style={{
            ...styles.navButton,
            ...(viewMode === 'learn' ? styles.activeNavButton : {})
          }}
        >
          &gt; Aprender
        </button>
        
        <button 
          onClick={startReview} 
          style={{
            ...styles.navButton,
            ...(viewMode === 'review' ? styles.activeNavButton : {})
          }}
        >
          Fav Revisar
        </button>
        
        <button 
          onClick={startQuiz} 
          style={{
            ...styles.navButton,
            ...(viewMode === 'quiz' ? styles.activeNavButton : {})
          }}
        >
          Info Quiz
        </button>
      </nav>
    </div>
  );
}

export default App;