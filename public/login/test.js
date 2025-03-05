// Study Hours Distribution Algorithm

function distributeStudyHours(subjects, availableHours, peakHours) {
    // Step 1: Assess Priorities
    const priorities = subjects.map(subject => {
      return {
        name: subject.name,
        difficulty: subject.difficulty, // 1 (easy) to 5 (hard)
        importance: subject.importance // 1 (low) to 5 (high)
      };
    });
  
    // Sort subjects by priority (difficulty * importance)
    priorities.sort((a, b) => (b.difficulty * b.importance) - (a.difficulty * a.importance));
  
    // Step 2: Analyze Schedule
    const totalHours = availableHours.reduce((sum, hours) => sum + hours, 0);
  
    // Step 3: Apply 50/30/20 Rule
    const hoursAllocation = {
      weak: totalHours * 0.5,
      average: totalHours * 0.3,
      strong: totalHours * 0.2
    };
  
    const categorizedSubjects = {
      weak: priorities.filter(sub => sub.difficulty >= 4),
      average: priorities.filter(sub => sub.difficulty === 3),
      strong: priorities.filter(sub => sub.difficulty <= 2)
    };
  
    const allocatedHours = {};
    for (const category in categorizedSubjects) {
      const subjects = categorizedSubjects[category];
      const hoursPerSubject = hoursAllocation[category] / subjects.length;
      subjects.forEach(subject => {
        allocatedHours[subject.name] = (allocatedHours[subject.name] || 0) + hoursPerSubject;
      });
    }
  
    // Step 4: Create Subject-Specific Plan
    const studyPlan = subjects.map(subject => {
      const tasks = subject.topics.map((topic, index) => ({
        task: `Study ${topic}`,
        duration: allocatedHours[subject.name] / subject.topics.length
      }));
      return { name: subject.name, tasks };
    });
  
    // Step 5: Include Active Learning Techniques
    const activeLearningStrategies = [
      "Practice Questions",
      "Summarization & Mnemonics",
      "Teaching Others"
    ];
  
    // Step 6: Regularly Review and Adjust (Placeholder for weekly adjustment logic)
  
    // Step 7: Factor in Breaks and Rest (Pomodoro Scheduling)
    const pomodoroPlan = studyPlan.flatMap(subject => {
      return subject.tasks.map(task => ({
        task: task.task,
        duration: task.duration,
        method: "Pomodoro (25 mins work, 5 mins break)"
      }));
    });
  
    return { allocatedHours, studyPlan, pomodoroPlan, activeLearningStrategies };
  }
  
  // Example Usage
  const subjects = [
    { name: "Math", difficulty: 5, importance: 5, topics: ["Algebra", "Geometry", "Calculus"] },
    { name: "History", difficulty: 3, importance: 4, topics: ["Ancient", "Medieval", "Modern"] },
    { name: "Science", difficulty: 4, importance: 5, topics: ["Physics", "Chemistry", "Biology"] },
    { name: "Literature", difficulty: 2, importance: 3, topics: ["Poetry", "Prose", "Drama"] }
  ];
  
  const availableHours = [2, 2, 3, 2, 2, 3, 4]; // Hours available for each day of the week
  const peakHours = [9, 10, 11]; // Productive morning hours
  
  const plan = distributeStudyHours(subjects, availableHours, peakHours);
  console.log(plan);
  