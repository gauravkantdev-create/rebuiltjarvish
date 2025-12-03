import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const geminiResponse = async (userInput) => {
  try {
    // ✅ Validate input
    if (!userInput || typeof userInput !== 'string') {
      throw new Error("Invalid input: prompt must be a non-empty string");
    }

    console.log("🧠 Processing prompt with Gemini AI:", userInput);
    
    const lowerInput = userInput.toLowerCase().trim();
    // Extract the user's actual question/content if the prompt was enhanced
    // (askToAssistant sends prompts like "... Question: <user prompt>")
    const extractQuestionContent = (text) => {
      try {
        const lower = text.toLowerCase();
        const marker = 'question:';
        const idx = lower.lastIndexOf(marker);
        if (idx !== -1) {
          return lower.slice(idx + marker.length).trim();
        }
        return lower;
      } catch (e) {
        return text.toLowerCase();
      }
    };
    const content = extractQuestionContent(userInput);
    
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'AIzaSyB3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R') {
      console.warn("⚠️ GEMINI_API_KEY not configured, using local responses only");
      // Use the extracted question content for local handlers to avoid false positives
      return getLocalResponse(content);
    }
    
    // ✅ Handle special requests locally first
    // Run local handlers against the extracted user content only to avoid
    // accidental matches caused by added context (dates, times, etc.) in
    // the full enhanced prompt.
    if (isReminderRequest(content)) {
      return handleReminderRequest(content);
    }

    if (isShowRemindersRequest(content)) {
      return handleShowRemindersRequest();
    }

    if (isMathematicalExpression(content)) {
      return handleMathCalculation(content);
    }

    if (isDateTimeRequest(content)) {
      return handleDateTimeRequest(content);
    }

    if (isRhymeRequest(content)) {
      return handleRhymeRequest(content);
    }
    
    // ✅ Use Gemini AI for general queries
    try {
      console.log("🚀 Sending request to Gemini AI...");
      
      const result = await model.generateContent(userInput);
      const response = await result.response;
      const text = response.text();
      
      console.log("✅ Received response from Gemini AI:", text.substring(0, 100) + "...");
      
      if (!text || text.trim() === '') {
        return "I'm sorry, I couldn't generate a proper response. Could you please rephrase your question?";
      }
      
      return text.trim();
      
    } catch (geminiError) {
      console.error("❌ Gemini API Error:", geminiError.message);
      
  // Fallback to local responses if Gemini fails
  console.log("🔄 Falling back to local responses...");
  // Use the extracted user content to avoid accidental math matches from context
  return getLocalResponse(content);
    }
  } catch (error) {
    console.error("🚨 Error in geminiResponse:", error.message);
    return "I apologize, but I encountered an error while processing your request. Please try again.";
  }
};

// Fallback function for local responses
const getLocalResponse = (lowerInput) => {
  const mockResponses = {
      // Greetings
      "hello": "Hello! I'm your virtual assistant. How can I help you today?",
      "hi": "Hi there! What can I do for you?",
      "how are you": "I'm doing great, thank you for asking! I'm here to assist you with any questions you have.",
      
      // Programming topics
      "javascript": "JavaScript is a popular programming language primarily used for web development. It enables interactive web pages and is an essential part of web applications. It runs in web browsers and can also be used on servers with Node.js. JavaScript is known for its dynamic typing, prototype-based object-orientation, and first-class functions.",
      "java": "Java is a high-level, object-oriented programming language developed by Sun Microsystems (now owned by Oracle). It's known for its 'write once, run anywhere' philosophy using the Java Virtual Machine (JVM). Java is widely used for enterprise applications, Android development, and large-scale systems.",
      "python": "Python is a high-level, interpreted programming language known for its simple, readable syntax. It's widely used in web development, data science, artificial intelligence, automation, and scientific computing. Python emphasizes code readability and has a large standard library.",
  "alexander": "Alexander the Great was a king of the ancient Greek kingdom of Macedon and one of history's most successful military commanders. He created one of the largest empires of the ancient world by the age of 30, stretching from Greece to Egypt and into northwest India. Alexander is known for spreading Greek culture across these regions and founding many cities, the most famous being Alexandria in Egypt.",
  "alexander the great": "Alexander the Great (356–323 BC) was the King of Macedon who built a vast empire across three continents. Tutored by Aristotle, he succeeded his father Philip II and led military campaigns that conquered Persia and reached India. His legacy includes the Hellenistic cultural diffusion and several cities he founded, notably Alexandria in Egypt.",
      "react": "React is a JavaScript library for building user interfaces, particularly web applications. It was developed by Facebook and is known for its component-based architecture, virtual DOM, and efficient updates. React allows developers to create reusable UI components and manage application state effectively.",
      "html": "HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure and content of a webpage using elements and tags. HTML works with CSS for styling and JavaScript for interactivity to create complete web applications.",
      "css": "CSS (Cascading Style Sheets) is a stylesheet language used to describe the presentation of HTML documents. It controls the layout, colors, fonts, and overall visual appearance of web pages. CSS enables responsive design and separates content from presentation.",
      "node": "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows JavaScript to run outside the browser, enabling server-side development. Node.js is popular for building scalable network applications, APIs, and real-time web services.",
      
      // General knowledge topics
      "science": "Science is the systematic study of the natural world through observation and experimentation. It helps us understand how things work, from the smallest particles to the largest galaxies. Science includes fields like physics, chemistry, biology, and earth sciences.",
      "technology": "Technology is the application of scientific knowledge for practical purposes. It includes tools, systems, and methods that solve problems and improve human life. From smartphones to artificial intelligence, technology shapes our modern world.",
      "history": "History is the study of past events, people, and civilizations. It helps us understand how societies evolved, learn from past mistakes, and appreciate cultural heritage. History includes everything from ancient civilizations to modern times.",
      "geography": "Geography is the study of Earth's physical features, climate, and human activity. It explores continents, oceans, mountains, countries, and how people interact with their environment. Geography helps us understand our world's diversity.",
      "mathematics": "Mathematics is the study of numbers, quantities, shapes, and patterns. It's the foundation of science and technology, used in everything from engineering to finance. Math helps us solve problems logically and think analytically. I can also help you with calculations!",
      "math": "Mathematics is the study of numbers, quantities, shapes, and patterns. It's the foundation of science and technology, used in everything from engineering to finance. Math helps us solve problems logically and think analytically. I can also help you with calculations!",
      "art": "Art is human creative expression through various mediums like painting, sculpture, music, and literature. It reflects culture, emotions, and ideas. Art has been part of human civilization for thousands of years and continues to inspire and move people.",
      "music": "Music is the art of arranging sounds in time to create compositions. It includes melody, harmony, rhythm, and timbre. Music is universal across cultures and can express emotions, tell stories, and bring people together.",
      "sports": "Sports are physical activities or games that involve competition and skill. They promote health, teamwork, and discipline. Popular sports include football, basketball, cricket, tennis, and swimming. Sports also bring communities together.",
      "food": "Food is any substance consumed to provide nutritional support for the body. Different cultures have unique cuisines reflecting their history, geography, and traditions. Food brings people together and is central to celebrations and daily life.",
      "weather": "Weather refers to atmospheric conditions including temperature, humidity, precipitation, and wind. It changes daily and affects our activities and mood. Weather patterns are studied by meteorologists to help us plan and stay safe.",
      
      // Indian History
      "indian history": "Indian history spans over 5,000 years, beginning with the Indus Valley Civilization. It includes ancient empires like Mauryan and Gupta, medieval kingdoms, Mughal rule, British colonial period, and independence in 1947. India has rich cultural heritage with diverse religions, languages, and traditions.",
      "india": "India is the world's largest democracy and seventh-largest country, with over 1.4 billion people. It has a rich history spanning 5,000 years, diverse cultures, and is known for contributions in mathematics, science, philosophy, and art. India gained independence from British rule in 1947.",
      "mahatma gandhi": "Mahatma Gandhi was the leader of India's independence movement against British rule. He advocated non-violent civil disobedience and inspired civil rights movements worldwide. Born in 1869, he led India to independence in 1947 and is known as the Father of the Nation.",
      "gandhi": "Mahatma Gandhi was the leader of India's independence movement against British rule. He advocated non-violent civil disobedience and inspired civil rights movements worldwide. Born in 1869, he led India to independence in 1947 and is known as the Father of the Nation.",
      "mauryan empire": "The Mauryan Empire was one of India's largest and most powerful empires, ruling from 322 to 185 BCE. Founded by Chandragupta Maurya, it reached its peak under Emperor Ashoka, who spread Buddhism across Asia. The empire covered most of the Indian subcontinent.",
      "ashoka": "Emperor Ashoka ruled the Mauryan Empire from 268 to 232 BCE. After the Kalinga War, he embraced Buddhism and non-violence, spreading Buddhist teachings across Asia. He is considered one of India's greatest emperors for his moral leadership and contributions to governance.",
      "mughal empire": "The Mughal Empire ruled most of the Indian subcontinent from 1526 to 1857. Founded by Babur, it reached its height under Akbar, known for religious tolerance, and Shah Jahan, who built the Taj Mahal. The empire created magnificent architecture and blended Indian, Persian, and Islamic cultures.",
      "taj mahal": "The Taj Mahal is a white marble mausoleum built in Agra between 1632 and 1653 by Mughal Emperor Shah Jahan in memory of his wife Mumtaz Mahal. It's considered one of the world's most beautiful buildings and a symbol of eternal love. The Taj Mahal is a UNESCO World Heritage Site.",
      "british raj": "The British Raj was the rule of the British Crown over the Indian subcontinent from 1858 to 1947. It began after the Indian Rebellion of 1857 and ended with India's independence. The period saw significant changes in administration, infrastructure, education, and the rise of the independence movement.",
      "indian independence": "India gained independence from British rule on August 15, 1947, after a long struggle led by Mahatma Gandhi and many other freedom fighters. The partition of India created Pakistan, leading to massive population movements. India became the world's largest democratic republic.",
      "chandragupta maurya": "Chandragupta Maurya founded the Mauryan Empire in 322 BCE and was one of India's greatest emperors. He unified most of the Indian subcontinent with the help of his advisor Chanakya. He later became a Jain monk and achieved spiritual liberation.",
      "chanakya": "Chanakya was an ancient Indian teacher, philosopher, and royal advisor who authored the Arthashastra, an ancient treatise on economics, politics, and military strategy. He helped establish the Mauryan Empire and is considered one of India's greatest strategists.",
      "akbar": "Akbar the Great was the third Mughal emperor, ruling from 1556 to 1605. He is known for religious tolerance, administrative reforms, and patronage of arts and culture. He established a syncretic religion called Din-i Ilahi and created a efficient governance system.",
      
      // Scientists and Discoveries
      "albert einstein": "Albert Einstein was a German-born theoretical physicist who developed the theory of relativity, one of the two pillars of modern physics. His equation E=mc² is famous worldwide. He won the Nobel Prize in Physics in 1921 for his explanation of the photoelectric effect.",
      "einstein": "Albert Einstein was a German-born theoretical physicist who developed the theory of relativity, one of the two pillars of modern physics. His equation E=mc² is famous worldwide. He won the Nobel Prize in Physics in 1921 for his explanation of the photoelectric effect.",
      "isaac newton": "Isaac Newton was an English mathematician, physicist, and astronomer who formulated the laws of motion and universal gravitation. He discovered calculus, studied optics, and wrote the Principia Mathematica, one of the most important scientific works ever written.",
      "newton": "Isaac Newton was an English mathematician, physicist, and astronomer who formulated the laws of motion and universal gravitation. He discovered calculus, studied optics, and wrote the Principia Mathematica, one of the most important scientific works ever written.",
      "marie curie": "Marie Curie was a Polish-French physicist and chemist who conducted pioneering research on radioactivity. She was the first woman to win a Nobel Prize, the first person to win Nobel Prizes in two different sciences, and discovered two elements: polonium and radium.",
      "curie": "Marie Curie was a Polish-French physicist and chemist who conducted pioneering research on radioactivity. She was the first woman to win a Nobel Prize, the first person to win Nobel Prizes in two different sciences, and discovered two elements: polonium and radium.",
      "charles darwin": "Charles Darwin was an English naturalist who proposed the theory of evolution by natural selection. His book On the Origin of Species revolutionized biology. Darwin's theory explains how species change over time through adaptation to their environment.",
      "darwin": "Charles Darwin was an English naturalist who proposed the theory of evolution by natural selection. His book On the Origin of Species revolutionized biology. Darwin's theory explains how species change over time through adaptation to their environment.",
      "galileo galilei": "Galileo was an Italian astronomer and physicist who played a major role in the scientific revolution. He discovered Jupiter's four largest moons, improved the telescope, and supported heliocentric theory. He is called the father of observational astronomy.",
      "galileo": "Galileo was an Italian astronomer and physicist who played a major role in the scientific revolution. He discovered Jupiter's four largest moons, improved the telescope, and supported heliocentric theory. He is called the father of observational astronomy.",
      "discovery": "Scientific discoveries have transformed human understanding of the world. Major discoveries include gravity by Newton, evolution by Darwin, relativity by Einstein, radioactivity by Marie Curie, and DNA structure by Watson and Crick. Each discovery opened new frontiers of knowledge.",
      "scientist": "Scientists are people who study the natural world through observation and experimentation. Famous scientists include Albert Einstein, Isaac Newton, Marie Curie, Charles Darwin, and Galileo. Their discoveries have shaped our understanding of physics, chemistry, biology, and astronomy.",
      
      // Bihar History and Contributions
      "bihar": "Bihar is an eastern Indian state with a rich history spanning over 3,000 years. It was the center of ancient Indian learning, power, and culture. Bihar was home to great empires like Mauryan and Gupta, and is the birthplace of Buddhism and Jainism. The ancient universities of Nalanda and Vikramashila were world-renowned centers of learning.",
      "nalanda": "Nalanda was an ancient Buddhist monastery and university in Bihar, active from 427 to 1197 CE. It was one of the world's first residential universities and attracted scholars from across Asia. Nalanda taught subjects like Buddhism, mathematics, astronomy, and medicine before being destroyed by invaders.",
      "vikramashila": "Vikramashila was another ancient university in Bihar, founded in the 8th century. It was a major center of Buddhist learning and tantric studies. The university attracted scholars from Tibet, China, and Southeast Asia, and played a crucial role in spreading Buddhist knowledge across Asia.",
      "buddha": "Gautama Buddha was born in Lumbini but attained enlightenment in Bodh Gaya, Bihar. He founded Buddhism, one of the world's major religions. Buddha taught the Four Noble Truths and the Eightfold Path, emphasizing meditation, ethical conduct, and wisdom to end suffering.",
      "bodh gaya": "Bodh Gaya in Bihar is where Gautama Buddha attained enlightenment under the Bodhi tree. It's the most sacred pilgrimage site for Buddhists worldwide. The Mahabodhi Temple complex, a UNESCO World Heritage Site, marks this location and attracts millions of pilgrims annually.",
      "mahavira": "Mahavira was the 24th and last Tirthankara of Jainism, born in 599 BCE in Bihar. He established the core principles of Jainism including non-violence, truth, and non-attachment. Mahavira's teachings emphasize spiritual purification through ethical living and self-discipline.",
      "jainism": "Jainism is an ancient Indian religion founded in Bihar. It emphasizes non-violence, truth, and self-control. Jainism has contributed significantly to Indian philosophy, mathematics, and literature. The religion's principles of environmental protection and vegetarianism are increasingly relevant today.",
      "chanakya niti": "Chanakya Niti refers to the ethical and political teachings of Chanakya, who was from Bihar. His treatise Arthashastra covers economics, politics, military strategy, and social welfare. Chanakya's principles of governance and diplomacy are still studied in modern management and political science.",
      "mauryan dynasty": "The Mauryan Dynasty originated in Bihar under Chandragupta Maurya with Chanakya's guidance. It was India's first great empire, unifying most of the subcontinent. The dynasty established efficient administration, promoted trade, and spread Buddhism across Asia.",
      "gupta empire": "The Gupta Empire, which had its origins in Bihar, is called India's Golden Age. From 320 to 550 CE, it saw great achievements in mathematics, astronomy, medicine, and literature. Aryabhata and Kalidasa were among the great scholars of this period.",
      "aryabhata": "Aryabhata was a brilliant mathematician and astronomer from Bihar who lived in the 5th century. He invented the concept of zero, calculated pi accurately, and proposed that Earth rotates on its axis. His works influenced mathematics and astronomy across the world.",
      "kalidasa": "Kalidasa was India's greatest Sanskrit poet and dramatist, active during the Gupta period with connections to Bihar. His works like Shakuntala and Meghaduta are masterpieces of Sanskrit literature. Kalidasa's poetry and plays continue to influence Indian literature and performing arts.",
      
      // Indian States
      "uttar pradesh": "Uttar Pradesh is India's most populous state, known for the Taj Mahal in Agra, holy cities like Varanasi, and the capital Lucknow. It has rich cultural heritage, historical monuments, and is the birthplace of many Prime Ministers. The state contributes significantly to India's politics and culture.",
      "maharashtra": "Maharashtra is India's wealthiest state, with Mumbai as its capital and India's financial hub. Known for the Ajanta and Ellora caves, Bollywood film industry, and vibrant Marathi culture. Maharashtra leads in industrial development and is home to India's largest stock exchange.",
      "west bengal": "West Bengal is known for Kolkata, India's cultural capital, and its rich literary and artistic heritage. The state produced Nobel laureates like Rabindranath Tagore and Mother Teresa. West Bengal is famous for Durga Puja festival, sweets, and intellectual contributions to India.",
      "tamil nadu": "Tamil Nadu is known for its ancient Dravidian culture, temples, and classical arts. Chennai is a major cultural and economic center. The state has made significant contributions to Indian literature, music, dance, and cinema. Tamil Nadu is also a leader in automotive and IT industries.",
      "rajasthan": "Rajasthan is India's largest state by area, known as the Land of Kings. Famous for palaces, forts, deserts, and colorful culture. Jaipur, the Pink City, and Udaipur, the City of Lakes, are major tourist destinations. Rajasthan's rich handicrafts and folk music attract visitors worldwide.",
      "karnataka": "Karnataka is known for Bangalore, India's Silicon Valley, and its contributions to IT and space research. The state has ancient temples at Hampi, beautiful palaces in Mysore, and rich classical music traditions. Karnataka leads in technology and education.",
      "gujarat": "Gujarat is known for its vibrant culture, business acumen, and as the birthplace of Mahatma Gandhi. The state leads in industrial development, petroleum refining, and dairy production. Gujarat's festivals like Navratri and cuisine are famous across India.",
      "andhra pradesh": "Andhra Pradesh is known for its rich Telugu culture, historical sites, and coastline. The state has made significant contributions to Indian classical music, dance, and cuisine. It's a major producer of rice and has growing IT and pharmaceutical industries.",
      "madhya pradesh": "Madhya Pradesh is called the Heart of India, known for its wildlife sanctuaries, ancient temples, and historical sites. Khajuraho temples and Sanchi Stupa are UNESCO World Heritage Sites. The state has rich tribal culture and significant mineral resources.",
      "punjab": "Punjab is known for its fertile agriculture, vibrant culture, and Golden Temple in Amritsar. The state is India's breadbasket, leading in wheat production. Punjabi music, dance, and cuisine are popular worldwide. Punjab has a rich Sikh heritage and history.",
      "haryana": "Haryana is known for its agricultural productivity, sports achievements, and proximity to Delhi. The state contributes significantly to India's food grain production and has produced many Olympic athletes. Haryana has rich cultural heritage and growing industrial sectors.",
      "delhi": "Delhi is India's capital territory, combining ancient history with modern development. Home to the Red Fort, India Gate, and Qutub Minar. Delhi is the political center and has diverse culture, excellent educational institutions, and growing service industries.",
      "kerala": "Kerala is known for its backwaters, beaches, high literacy rates, and human development achievements. The state has rich cultural traditions, Ayurvedic medicine, and spice plantations. Kerala leads in education, healthcare, and tourism.",
      "odisha": "Odisha is known for ancient temples like Konark Sun Temple, tribal culture, and coastline. The state has rich classical dance traditions and handicrafts. Odisha contributes significantly to India's steel production and has diverse cultural heritage.",
      "telangana": "Telangana is India's youngest state, with Hyderabad as its capital. Known for IT industry, historical monuments, and rich cuisine. The state has made significant contributions to Indian technology sector and has unique cultural traditions.",
      "assam": "Assam is known for tea gardens, wildlife sanctuaries, and the Brahmaputra River. The state has rich Assamese culture and is famous for one-horned rhinoceros. Assam contributes significantly to India's tea production and petroleum industry.",
      "jharkhand": "Jharkhand is rich in mineral resources and tribal culture. Known for industrial cities like Jamshedpur and natural beauty. The state has significant contributions to India's steel production and has diverse tribal traditions.",
      "chhattisgarh": "Chhattisgarh is known for its tribal culture, mineral wealth, and ancient temples. The state has rich cultural heritage and growing industrial sectors. Chhattisgarh contributes significantly to India's steel and power production.",
      "uttarakhand": "Uttarakhand is known as the Land of Gods, with Himalayan mountains, pilgrimage sites, and natural beauty. The state has rich cultural traditions and is a major destination for spiritual tourism and adventure sports.",
      "himachal pradesh": "Himachal Pradesh is known for its Himalayan landscapes, hill stations, and apple cultivation. The state has high literacy rates and growing tourism. Shimla and Manali are popular destinations, and the state leads in hydropower generation.",
      "punjab": "Punjab is known for its fertile agriculture, vibrant culture, and Golden Temple in Amritsar. The state is India's breadbasket, leading in wheat production. Punjabi music, dance, and cuisine are popular worldwide. Punjab has a rich Sikh heritage and history.",
      "goa": "Goa is known for its beautiful beaches, Portuguese heritage, and vibrant culture. The smallest state by area, Goa attracts tourists with its coastline, churches, and carnival. The state has unique Indo-Portuguese culture and cuisine.",
      "sikkim": "Sikkim is known for its Himalayan mountains, monasteries, and biodiversity. The state is India's first fully organic state and has rich cultural heritage. Sikkim is a major destination for eco-tourism and Buddhist pilgrimage.",
      "jammu and kashmir": "Jammu and Kashmir is known as Paradise on Earth, with stunning Himalayan landscapes, lakes, and gardens. The state has rich cultural heritage and is famous for handicrafts, tourism, and natural beauty. It has diverse religious and cultural traditions.",
      "ladakh": "Ladakh is known for its high-altitude desert landscapes, Buddhist monasteries, and adventure sports. The region has unique Tibetan culture and is a major destination for mountain tourism and spiritual journeys.",
      "andaman and nicobar": "Andaman and Nicobar Islands are known for pristine beaches, coral reefs, and tropical forests. The union territory has rich marine biodiversity and historical significance from India's independence struggle. It's a major destination for eco-tourism.",
      "lakshadweep": "Lakshadweep is India's smallest union territory, known for coral atolls, beaches, and marine life. The islands have unique culture and are famous for water sports and coconut cultivation. Lakshadweep is a pristine destination for island tourism.",
      "puducherry": "Puducherry is known for its French colonial heritage, beaches, and spiritual communities. The union territory has unique Indo-French culture and is famous for Aurobindo Ashram and Auroville. Puducherry attracts tourists with its distinct architecture and peaceful atmosphere.",
      
      // Specific historical topics
      "president": "The first President of the United States was George Washington. He served from 1789 to 1797 and is known as the Father of the Country. Washington led the Continental Army to victory in the American Revolutionary War and helped establish the foundations of American democracy.",
      "washington": "George Washington was the first President of the United States and a Founding Father. He served as commander-in-chief of the Continental Army during the American Revolutionary War and presided over the convention that drafted the U.S. Constitution. He served two terms as president from 1789 to 1797.",
      "abraham lincoln": "Abraham Lincoln was the 16th President of the United States, serving from 1861 until his assassination in 1865. He led the country during the American Civil War, abolished slavery with the Emancipation Proclamation, and is considered one of America's greatest presidents.",
      "lincoln": "Abraham Lincoln was the 16th President of the United States, serving from 1861 until his assassination in 1865. He led the country during the American Civil War, abolished slavery with the Emancipation Proclamation, and is considered one of America's greatest presidents.",
      "world war": "World War I was fought from 1914 to 1918 and involved over 30 countries. World War II was fought from 1939 to 1945 and was the deadliest conflict in human history, involving over 100 million people from more than 30 countries.",
      "ancient egypt": "Ancient Egypt was a civilization of ancient North Africa, concentrated along the lower reaches of the Nile River. It is known for its pyramids, pharaohs, hieroglyphics, and contributions to mathematics, medicine, and architecture that lasted for over 3,000 years.",
      "egypt": "Ancient Egypt was a civilization of ancient North Africa, concentrated along the lower reaches of the Nile River. It is known for its pyramids, pharaohs, hieroglyphics, and contributions to mathematics, medicine, and architecture that lasted for over 3,000 years.",
      "roman empire": "The Roman Empire was one of the largest empires in history, ruling from 27 BC to 476 AD. It covered much of Europe, North Africa, and the Middle East. The Romans made significant contributions to law, engineering, language, and governance that influence modern society.",
      "rome": "The Roman Empire was one of the largest empires in history, ruling from 27 BC to 476 AD. It covered much of Europe, North Africa, and the Middle East. The Romans made significant contributions to law, engineering, language, and governance that influence modern society.",
      "christopher columbus": "Christopher Columbus was an Italian explorer who completed four voyages across the Atlantic Ocean, opening the way for widespread European exploration and colonization of the Americas. He reached the Americas in 1492 while sailing for Spain.",
      "columbus": "Christopher Columbus was an Italian explorer who completed four voyages across the Atlantic Ocean, opening the way for widespread European exploration and colonization of the Americas. He reached the Americas in 1492 while sailing for Spain.",
      "american revolution": "The American Revolution was fought from 1775 to 1783 when the 13 American colonies rejected British rule to establish the United States of America. Key events include the Boston Tea Party, Declaration of Independence in 1776, and the surrender at Yorktown.",
      "revolution": "The American Revolution was fought from 1775 to 1783 when the 13 American colonies rejected British rule to establish the United States of America. Key events include the Boston Tea Party, Declaration of Independence in 1776, and the surrender at Yorktown.",
      "renaissance": "The Renaissance was a period of cultural, artistic, political, and economic rebirth following the Middle Ages in Europe. It lasted from the 14th to 17th centuries and saw renewed interest in classical learning, art, and science, producing figures like Leonardo da Vinci and Michelangelo.",
      "industrial revolution": "The Industrial Revolution was the transition to new manufacturing processes from about 1760 to 1840. It began in Britain and spread throughout the world, transforming agricultural societies into industrial ones and changing how people worked and lived.",
      "civil war": "The American Civil War was fought from 1861 to 1865 between the Northern states and the Southern states that seceded to form the Confederacy. The war was primarily about slavery and states' rights, resulting in the abolition of slavery and preservation of the United States.",
      "martin luther king": "Martin Luther King Jr. was an American Baptist minister and activist who became the most visible spokesperson and leader in the civil rights movement from 1955 until his assassination in 1968. He is known for his advocacy of nonviolent civil disobedience and his 'I Have a Dream' speech.",
      "king": "Martin Luther King Jr. was an American Baptist minister and activist who became the most visible spokesperson and leader in the civil rights movement from 1955 until his assassination in 1968. He is known for his advocacy of nonviolent civil disobedience and his 'I Have a Dream' speech.",
      
      // Conversational responses
      "thank": "You're welcome! Is there anything else I can help you with?",
      "bye": "Goodbye! Feel free to come back anytime you have questions.",
      "reminder": "I can help you set reminders! Just tell me what you want to remember and when. For example, 'remind me to call mom at 5 pm' or 'remind me about the meeting tomorrow at 10 am'. I'll remember it and remind you at the right time!",
      "remind": "I can help you set reminders! Just tell me what you want to remember and when. For example, 'remind me to call mom at 5 pm' or 'remind me about the meeting tomorrow at 10 am'. I'll remember it and remind you at the right time!",
      "remember": "I can help you remember things! Just tell me what you want to remember, and I'll store it for you. You can ask me 'what did I tell you to remember' to see all your reminders.",
      "default": "I'm your virtual assistant! I can help you with various topics including programming languages like JavaScript, Python, Java, science, technology, history, geography, mathematics, art, music, sports, food, weather, and I can also do calculations, tell you the current date and time, share rhymes, and set reminders! What would you like to know?"
    };

    // First, try to handle multi-part or compound queries by splitting into
    // simple sentences. Many users speak or type combined requests like
    // "what is the date who was alexander and simple maths calculations".
    // We'll process each piece and return the most relevant answer(s).
    const pieces = lowerInput.split(/[\.?;]+/).map(p => p.trim()).filter(Boolean);

    const pieceResponses = [];
    for (const piece of pieces) {
      // Direct date/time
      if (piece.includes('date') || piece.includes('time') || piece.includes("what time") || piece.includes("what date") ) {
        pieceResponses.push(handleDateTimeRequest(piece));
        continue;
      }

      // Mathematical intent
      if (isMathematicalExpression(piece)) {
        pieceResponses.push(handleMathCalculation(piece));
        continue;
      }

      // If user mentions 'math' or 'maths' but no expression, provide guidance
      if (piece.includes('math') || piece.includes('maths')) {
        pieceResponses.push("I can help with calculations — try asking something like 'what is 2 plus 2' or 'calculate 10 times 5'.");
        continue;
      }

      // Who/what lookups for well-known keywords (e.g., Alexander)
      if (piece.includes('who') || piece.startsWith('who is') || piece.startsWith('who was')) {
        // try keyword match
        for (const { key, response: keywordResponse } of keywords) {
          if (piece.includes(key)) {
            pieceResponses.push(keywordResponse);
            break;
          }
        }
        // if nothing matched, fall through to later generic handling
      }
    }

    if (pieceResponses.length > 0) {
      // Return combined piece responses (joined by two newlines for readability)
      return pieceResponses.join('\n\n');
    }

    let response = mockResponses.default;
    
    // Enhanced keyword matching with priority order (longer phrases first)
    const keywords = [
      // Programming (highest priority for specific terms)
      { key: "javascript", response: mockResponses.javascript },
      { key: "java", response: mockResponses.java },
      { key: "python", response: mockResponses.python },
      { key: "react", response: mockResponses.react },
      { key: "html", response: mockResponses.html },
      { key: "css", response: mockResponses.css },
      { key: "node", response: mockResponses.node },
      { key: "nodejs", response: mockResponses.node },
      { key: "node.js", response: mockResponses.node },
      
      // Indian History (highest priority - longer phrases first)
      { key: "indian history", response: mockResponses["indian history"] },
      { key: "indian independence", response: mockResponses["indian independence"] },
      { key: "chandragupta maurya", response: mockResponses["chandragupta maurya"] },
      { key: "mahatma gandhi", response: mockResponses["mahatma gandhi"] },
      { key: "mauryan empire", response: mockResponses["mauryan empire"] },
      { key: "mughal empire", response: mockResponses["mughal empire"] },
      { key: "taj mahal", response: mockResponses["taj mahal"] },
      { key: "british raj", response: mockResponses["british raj"] },
      { key: "mauryan dynasty", response: mockResponses["mauryan dynasty"] },
      { key: "gupta empire", response: mockResponses["gupta empire"] },
      
      // Scientists and Discoveries
      { key: "albert einstein", response: mockResponses["albert einstein"] },
      { key: "isaac newton", response: mockResponses["isaac newton"] },
      { key: "marie curie", response: mockResponses["marie curie"] },
      { key: "charles darwin", response: mockResponses["charles darwin"] },
      { key: "galileo galilei", response: mockResponses["galileo galilei"] },
      
      // Bihar History and Contributions
      { key: "chanakya niti", response: mockResponses["chanakya niti"] },
      { key: "bodh gaya", response: mockResponses["bodh gaya"] },
      { key: "vikramashila", response: mockResponses["vikramashila"] },
      { key: "ancient egypt", response: mockResponses["ancient egypt"] },
      { key: "roman empire", response: mockResponses["roman empire"] },
      { key: "american revolution", response: mockResponses["american revolution"] },
      { key: "industrial revolution", response: mockResponses["industrial revolution"] },
      { key: "civil war", response: mockResponses["civil war"] },
      { key: "christopher columbus", response: mockResponses["christopher columbus"] },
      { key: "martin luther king", response: mockResponses["martin luther king"] },
      { key: "abraham lincoln", response: mockResponses["abraham lincoln"] },
      
      // Indian States (longer names first)
      { key: "uttar pradesh", response: mockResponses["uttar pradesh"] },
      { key: "andhra pradesh", response: mockResponses["andhra pradesh"] },
      { key: "madhya pradesh", response: mockResponses["madhya pradesh"] },
      { key: "himachal pradesh", response: mockResponses["himachal pradesh"] },
      { key: "jammu and kashmir", response: mockResponses["jammu and kashmir"] },
      { key: "andaman and nicobar", response: mockResponses["andaman and nicobar"] },
      { key: "west bengal", response: mockResponses["west bengal"] },
      { key: "tamil nadu", response: mockResponses["tamil nadu"] },
      { key: "maharashtra", response: mockResponses["maharashtra"] },
      { key: "karnataka", response: mockResponses["karnataka"] },
      { key: "rajasthan", response: mockResponses["rajasthan"] },
      { key: "chhattisgarh", response: mockResponses["chhattisgarh"] },
      { key: "uttarakhand", response: mockResponses["uttarakhand"] },
      { key: "telangana", response: mockResponses["telangana"] },
      { key: "jharkhand", response: mockResponses["jharkhand"] },
      { key: "lakshadweep", response: mockResponses["lakshadweep"] },
      { key: "puducherry", response: mockResponses["puducherry"] },
      
      // Single word states and places
      { key: "bihar", response: mockResponses.bihar },
      { key: "india", response: mockResponses.india },
      { key: "gandhi", response: mockResponses.gandhi },
      { key: "ashoka", response: mockResponses.ashoka },
      { key: "akbar", response: mockResponses.akbar },
      { key: "chanakya", response: mockResponses.chanakya },
      { key: "nalanda", response: mockResponses.nalanda },
      { key: "buddha", response: mockResponses.buddha },
      { key: "mahavira", response: mockResponses.mahavira },
      { key: "jainism", response: mockResponses.jainism },
      { key: "aryabhata", response: mockResponses.aryabhata },
      { key: "kalidasa", response: mockResponses.kalidasa },
      { key: "einstein", response: mockResponses.einstein },
      { key: "newton", response: mockResponses.newton },
      { key: "curie", response: mockResponses.curie },
      { key: "darwin", response: mockResponses.darwin },
      { key: "galileo", response: mockResponses.galileo },
      { key: "discovery", response: mockResponses.discovery },
      { key: "scientist", response: mockResponses.scientist },
      { key: "gujarat", response: mockResponses.gujarat },
      { key: "kerala", response: mockResponses.kerala },
      { key: "odisha", response: mockResponses.odisha },
      { key: "assam", response: mockResponses.assam },
      { key: "punjab", response: mockResponses.punjab },
      { key: "haryana", response: mockResponses.haryana },
      { key: "delhi", response: mockResponses.delhi },
      { key: "goa", response: mockResponses.goa },
      { key: "sikkim", response: mockResponses.sikkim },
      { key: "ladakh", response: mockResponses.ladakh },
      { key: "egypt", response: mockResponses.egypt },
      { key: "rome", response: mockResponses.rome },
      { key: "columbus", response: mockResponses.columbus },
      { key: "lincoln", response: mockResponses.lincoln },
      { key: "washington", response: mockResponses.washington },
      { key: "king", response: mockResponses.king },
      { key: "president", response: mockResponses.president },
      { key: "revolution", response: mockResponses.revolution },
      { key: "renaissance", response: mockResponses.renaissance },
      { key: "world war", response: mockResponses["world war"] },
      
      // General knowledge (lower priority)
      { key: "science", response: mockResponses.science },
      { key: "technology", response: mockResponses.technology },
      { key: "history", response: mockResponses.history },
      { key: "geography", response: mockResponses.geography },
      { key: "mathematics", response: mockResponses.mathematics },
      { key: "math", response: mockResponses.math },
      { key: "art", response: mockResponses.art },
      { key: "music", response: mockResponses.music },
      { key: "sports", response: mockResponses.sports },
      { key: "sport", response: mockResponses.sports },
      { key: "food", response: mockResponses.food },
      { key: "weather", response: mockResponses.weather },
      
      // Greetings (lowest priority)
      { key: "hello", response: mockResponses.hello },
      { key: "hi", response: mockResponses.hello },
      { key: "how are you", response: mockResponses["how are you"] },
      { key: "thank", response: mockResponses.thank },
      { key: "bye", response: mockResponses.bye },
      { key: "reminder", response: mockResponses.reminder },
      { key: "remind", response: mockResponses.remind },
      { key: "remember", response: mockResponses.remember }
    ];
    
    // Check for keywords with better matching
    for (const { key, response: keywordResponse } of keywords) {
      if (lowerInput.includes(key)) {
        response = keywordResponse;
        break;
      }
    }
    
    // Handle common follow-up patterns with broader responses
    if (response === mockResponses.default) {
      // Quick date/time detection for common conversational phrases (including contractions)
      if (lowerInput.includes("time") || lowerInput.includes("date") || lowerInput.includes("timing") || lowerInput.includes("what's the time") || lowerInput.includes("what's the date") || lowerInput.includes("what's the timing") ) {
        const nowQuick = new Date();
        const timeStringQuick = nowQuick.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
        response = `The current time is ${timeStringQuick}.`;
      } else if (lowerInput.includes("what is") || lowerInput.includes("tell me about") || 
          lowerInput.includes("explain") || lowerInput.includes("describe") ||
          lowerInput.includes("define") || lowerInput.includes("help me understand")) {
        response = "I'd be happy to help! I can provide information about a wide range of topics including programming (JavaScript, Python, Java), science, technology, history, geography, mathematics, art, music, sports, food, weather, and I can also do calculations, tell you the current date and time, and share rhymes! Could you please specify which topic you'd like to learn about?";
      } else if (lowerInput.includes("thank") || lowerInput.includes("thanks")) {
        response = "You're welcome! Is there anything else I can help you with?";
      } else if (lowerInput.includes("bye") || lowerInput.includes("goodbye")) {
        response = "Goodbye! Feel free to come back anytime you have questions.";
      } else if (lowerInput.includes("help") || lowerInput.includes("what can you do")) {
        response = "I can help you learn about various topics! Ask me about programming languages like JavaScript, Python, Java, or general knowledge subjects like science, technology, history, geography, mathematics, art, music, sports, food, weather. I can also do mathematical calculations, tell you the current date and time, and share rhymes with you!";
      } else if (lowerInput.includes("how do i") || lowerInput.includes("how to")) {
        response = "I can guide you through various concepts! For specific 'how-to' questions, please mention the topic you're interested in - whether it's programming, science, technology, or any other subject, and I'll provide helpful guidance.";
      } else if (lowerInput.includes("difference") || lowerInput.includes("compare") || lowerInput.includes("vs")) {
        response = "I can help you compare different topics! Ask me about differences like 'JavaScript vs Python', 'science vs technology', or any other subjects you'd like to compare, and I'll explain the key distinctions.";
      } else if (lowerInput.includes("example") || lowerInput.includes("show me")) {
        response = "I can provide examples and explanations! Please specify which topic you'd like examples for - whether it's programming concepts, scientific principles, historical events, or any other subject.";
      } else if (lowerInput.includes("more") || lowerInput.includes("elaborate") || lowerInput.includes("detail")) {
        response = "I'd be happy to provide more details! Could you specify which topic you'd like me to elaborate on? I can go deeper into programming, science, technology, history, geography, mathematics, art, music, sports, food, weather, or any other subject.";
      } else {
        // Try to provide a helpful response based on common topics
        if (lowerInput.includes("who") || lowerInput.includes("when") || lowerInput.includes("where") || lowerInput.includes("why")) {
          response = "I can help answer questions about people, places, times, and reasons! Please provide more details about what specific person, event, location, or explanation you're looking for, and I'll do my best to help.";
        } else {
          response = "I'm here to help! I can assist with questions about programming, science, technology, history, geography, mathematics, art, music, sports, food, weather, and many other topics. I can also do calculations, tell you the current date and time, and share rhymes! Could you please rephrase your question or let me know what subject you're interested in?";
        }
      }
    }

    console.log("✅ Local response generated successfully");
    return response;
};

// ✅ Mathematical expression handler
const isMathematicalExpression = (input) => {
  // More comprehensive patterns for math expressions
  const mathPatterns = [
    /\b(\d+)\s*(plus|add|\+)\s*(\d+)\b/i,
    /\b(\d+)\s*(minus|subtract|-)\s*(\d+)\b/i,
    /\b(\d+)\s*(times|multiply|\*|x)\s*(\d+)\b/i,
    /\b(\d+)\s*(divide|\/|divided by)\s*(\d+)\b/i,
    /\bwhat\s+is\s+(\d+)\s*(plus|add|minus|subtract|times|multiply|divide|\/|\+|-|\*|x)\s*(\d+)\b/i,
    /\bcalculate\s+(\d+)\s*(plus|add|minus|subtract|times|multiply|divide|\/|\+|-|\*|x)\s*(\d+)\b/i,
    /\b(\d+)\s*(plus|add|minus|subtract|times|multiply|divide|\/|\+|-|\*|x)\s*(\d+)/i
  ];
  
  return mathPatterns.some(pattern => pattern.test(input));
};

const handleMathCalculation = (input) => {
  try {
    // Extract mathematical expression
    let expression = input;
    
    // Replace words with operators
    expression = expression.replace(/plus/gi, '+');
    expression = expression.replace(/minus/gi, '-');
    expression = expression.replace(/times/gi, '*');
    expression = expression.replace(/multiply/gi, '*');
    expression = expression.replace(/divide/gi, '/');
    expression = expression.replace(/divided by/gi, '/');
    expression = expression.replace(/to the power of/gi, '**');
    expression = expression.replace(/squared/gi, '**2');
    expression = expression.replace(/cubed/gi, '**3');
    
    // Simple approach: find all numbers and operators in order
    const numbers = expression.match(/\d+/g) || [];
    const operators = expression.match(/[+\-*/]/g) || [];
    
    if (numbers.length < 2) {
      return "I can help with mathematical calculations! Please provide a clear mathematical expression like 'what is 2 plus 2' or 'calculate 10 times 5'.";
    }
    
    // Build the expression from numbers and operators
    let cleanExpression = numbers[0];
    for (let i = 0; i < operators.length && i < numbers.length - 1; i++) {
      cleanExpression += operators[i] + numbers[i + 1];
    }
    
    // Safe evaluation (basic math only)
    const result = Function('"use strict"; return (' + cleanExpression + ')')();
    
    if (isNaN(result) || !isFinite(result)) {
      return "I couldn't calculate that. Please make sure your mathematical expression is valid.";
    }
    
    // Format the response
    if (Number.isInteger(result)) {
      return `The answer is ${result}. That was ${cleanExpression} equals ${result}.`;
    } else {
      return `The answer is ${result.toFixed(2)}. That was approximately ${result.toFixed(2)}.`;
    }
  } catch (error) {
    return "I had trouble calculating that. Please try a simpler mathematical expression like 'what is 5 plus 3' or 'calculate 10 times 4'.";
  }
};

// ✅ Date and time handler
const isDateTimeRequest = (input) => {
  // Accept more conversational variants and contractions like "what's the time" and "timing"
  return /(what('?| i)s\s+(the\s+)?(current\s+)?(date|time|timing|day|time\s+now|date\s+today)|what\s+time\s+is\s+it|what('?| i)s\s+the\s+time|what('?| i)s\s+the\s+date|what('?| i)s\s+the\s+timing|what\s+day\s+is\s+it|tell\s+me\s+the\s+(date|time|day)|current\s+(date|time)|what\s+(date|time)\s+is\s+it|show\s+me\s+the\s+(date|time)|today's\s+date|what\s+is\s+today)/i.test(input);
};

const handleDateTimeRequest = (input) => {
  const now = new Date();
  
  if (input.includes('time') || input.includes('clock')) {
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
    return `The current time is ${timeString}.`;
  } else if (input.includes('date') || input.includes('today')) {
    const dateString = now.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    return `Today is ${dateString}.`;
  } else if (input.includes('day')) {
    const dayString = now.toLocaleDateString('en-US', { weekday: 'long' });
    return `Today is ${dayString}.`;
  } else {
    const dateTimeString = now.toLocaleString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    return `The current date and time is ${dateTimeString}.`;
  }
};

// ✅ Rhyme handler
const isRhymeRequest = (input) => {
  return /rhyme|poem|poetry|sing|song|nursery|little/.test(input);
};

const handleRhymeRequest = (input) => {
  const rhymes = [
    "Twinkle, twinkle, little star, how I wonder what you are. Up above the world so high, like a diamond in the sky.",
    "Baa, baa, black sheep, have you any wool? Yes sir, yes sir, three bags full. One for the master, one for the dame, and one for the little boy who lives down the lane.",
    "Humpty Dumpty sat on a wall, Humpty Dumpty had a great fall. All the king's horses and all the king's men, couldn't put Humpty together again.",
    "Jack and Jill went up the hill to fetch a pail of water. Jack fell down and broke his crown, and Jill came tumbling after.",
    "Hey diddle diddle, the cat and the fiddle, the cow jumped over the moon. The little dog laughed to see such sport, and the dish ran away with the spoon.",
    "Mary had a little lamb, its fleece was white as snow. And everywhere that Mary went, the lamb was sure to go.",
    "Row, row, row your boat, gently down the stream. Merrily, merrily, merrily, merrily, life is but a dream.",
    "The itsy bitsy spider went up the water spout. Down came the rain and washed the spider out. Out came the sun and dried up all the rain, and the itsy bitsy spider went up the spout again."
  ];
  
  const randomRhyme = rhymes[Math.floor(Math.random() * rhymes.length)];
  
  if (input.includes('another') || input.includes('more')) {
    return `Here's another rhyme for you: ${randomRhyme}`;
  } else {
    return `Here's a lovely rhyme for you: ${randomRhyme}`;
  }
};

// ✅ Reminder handler
const isReminderRequest = (input) => {
  return /remind me|set reminder|remember to|don't forget|reminder at|remind at|dont forget/.test(input);
};

const isShowRemindersRequest = (input) => {
  return /what did i tell you to remember|show reminders|my reminders|what reminders|list reminders|what do i need to remember/.test(input);
};

// In-memory storage for reminders (in production, use a database)
let reminders = [];

const handleReminderRequest = (input) => {
  try {
    // Extract reminder text and time
    const reminderText = extractReminderText(input);
    const reminderTime = extractReminderTime(input);
    
    if (!reminderText) {
      return "I can help you set reminders! Please tell me what you want to remember and when. For example, 'remind me to call mom at 5 pm' or 'remind me about the meeting tomorrow at 10 am'.";
    }
    
    // Create reminder object
    const reminder = {
      id: Date.now(),
      text: reminderText,
      time: reminderTime,
      createdAt: new Date().toISOString(),
      triggered: false
    };
    
    // Store reminder
    reminders.push(reminder);
    
    // Schedule the reminder
    if (reminderTime) {
      scheduleReminder(reminder);
    }
    
    const timeText = reminderTime ? ` at ${reminderTime.toLocaleString()}` : '';
    return `I'll remember to ${reminderText}${timeText}. I've set your reminder and will notify you when it's time!`;
  } catch (error) {
    return "I had trouble setting that reminder. Please try again with a clear format like 'remind me to call mom at 5 pm'.";
  }
};

const handleShowRemindersRequest = () => {
  if (reminders.length === 0) {
    return "You don't have any reminders set. You can ask me to remind you of anything by saying 'remind me to [task] at [time]'.";
  }
  
  const activeReminders = reminders.filter(r => !r.triggered);
  const triggeredReminders = reminders.filter(r => r.triggered);
  
  let response = `You have ${activeReminders.length} active reminder${activeReminders.length !== 1 ? 's' : ''}:\n`;
  
  activeReminders.forEach((reminder, index) => {
    const timeText = reminder.time ? ` at ${reminder.time.toLocaleString()}` : '';
    response += `${index + 1}. ${reminder.text}${timeText}\n`;
  });
  
  if (triggeredReminders.length > 0) {
    response += `\nYou've completed ${triggeredReminders.length} reminder${triggeredReminders.length !== 1 ? 's' : ''}.`;
  }
  
  return response.trim();
};

const extractReminderText = (input) => {
  // Extract the task/reminder text
  const patterns = [
    /remind me to (.+?)(?: at | in | on | tomorrow | today|$)/i,
    /remind me (.+?)(?: at | in | on | tomorrow | today|$)/i,
    /remember to (.+?)(?: at | in | on | tomorrow | today|$)/i,
    /don't forget to (.+?)(?: at | in | on | tomorrow | today|$)/i,
    /dont forget to (.+?)(?: at | in | on | tomorrow | today|$)/i,
    /set reminder to (.+?)(?: at | in | on | tomorrow | today|$)/i
  ];
  
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return null;
};

const extractReminderTime = (input) => {
  const now = new Date();
  
  // Extract time patterns
  const timePatterns = [
    /at (\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i,
    /(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i,
    /in (\d+)\s*(minute|minutes|hour|hours|day|days)s?/i,
    /tomorrow at (\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i,
    /today at (\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i,
    /next (\w+) at (\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i
  ];
  
  for (const pattern of timePatterns) {
    const match = input.match(pattern);
    if (match) {
      if (match[0].includes('in')) {
        // Relative time (in 5 minutes, in 2 hours, etc.)
        const amount = parseInt(match[1]);
        const unit = match[2].toLowerCase();
        
        const reminderTime = new Date();
        switch (unit) {
          case 'minute':
          case 'minutes':
            reminderTime.setMinutes(reminderTime.getMinutes() + amount);
            break;
          case 'hour':
          case 'hours':
            reminderTime.setHours(reminderTime.getHours() + amount);
            break;
          case 'day':
          case 'days':
            reminderTime.setDate(reminderTime.getDate() + amount);
            break;
        }
        return reminderTime;
      } else if (match[0].includes('tomorrow')) {
        // Tomorrow at specific time
        const hours = parseInt(match[1]);
        const minutes = match[2] ? parseInt(match[2]) : 0;
        const period = match[3] ? match[3].toLowerCase() : null;
        
        const reminderTime = new Date();
        reminderTime.setDate(reminderTime.getDate() + 1);
        reminderTime.setHours(convertTo24Hour(hours, period), minutes, 0, 0);
        return reminderTime;
      } else {
        // Specific time today
        const hours = parseInt(match[1]);
        const minutes = match[2] ? parseInt(match[2]) : 0;
        const period = match[3] ? match[3].toLowerCase() : null;
        
        const reminderTime = new Date();
        reminderTime.setHours(convertTo24Hour(hours, period), minutes, 0, 0);
        
        // If the time has passed today, schedule for tomorrow
        if (reminderTime <= now) {
          reminderTime.setDate(reminderTime.getDate() + 1);
        }
        return reminderTime;
      }
    }
  }
  
  return null; // No specific time found
};

const convertTo24Hour = (hours, period) => {
  if (period === 'am' && hours === 12) return 0;
  if (period === 'pm' && hours !== 12) return hours + 12;
  return hours;
};

const scheduleReminder = (reminder) => {
  if (!reminder.time) return;
  
  const now = new Date();
  const timeUntilReminder = reminder.time - now;
  
  if (timeUntilReminder <= 0) {
    // Reminder time is in the past, trigger immediately
    triggerReminder(reminder);
    return;
  }
  
  setTimeout(() => {
    triggerReminder(reminder);
  }, timeUntilReminder);
};

const triggerReminder = (reminder) => {
  reminder.triggered = true;
  console.log(`🔔 REMINDER: ${reminder.text}`);
  
  // In a real application, you would send this to the client
  // For now, we'll just log it and mark as triggered
  console.log(`✅ Reminder triggered at ${new Date().toLocaleString()}: ${reminder.text}`);
};

export default geminiResponse;
