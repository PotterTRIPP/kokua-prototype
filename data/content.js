// Helper to create steps efficiently
const generateSteps = () => {
  const steps = [];
  
  for (let i = 1; i <= 15; i++) {
    // Every 5th step is a Checkpoint
    const isCheckpoint = i % 5 === 0;
    
    steps.push({
      id: `step_${i}`,
      // Logic: If checkpoint, type is 'checkpoint'. If not, alternate audio/task.
      type: isCheckpoint ? 'checkpoint' : (i % 2 === 0 ? 'task' : 'audio'),
      duration: isCheckpoint ? 'Check-in' : (i % 2 === 0 ? 'Active' : '5 min'),
      base_title: isCheckpoint ? 'Kokua Check-in' : `Level ${i}`,
      is_checkpoint: isCheckpoint, // This triggers the 10 point reward
      
      archetype_skins: {
        builder: {
          title: isCheckpoint ? "Site Inspection" : `Foundation Layer ${i}`,
          description: isCheckpoint ? "Review structural integrity with Kokua." : "Reinforce the daily habits.",
          icon: isCheckpoint ? "👷" : (i % 2 === 0 ? "🔨" : "🧱"),
          challenge: "Identify 3 things that are working well."
        },
        explorer: {
          title: isCheckpoint ? "Captain's Log" : `Waypoint ${i}`,
          description: isCheckpoint ? "Update the map with new discoveries." : "Chart the course ahead.",
          icon: isCheckpoint ? "🧭" : (i % 2 === 0 ? "🔭" : "🗺️"),
          challenge: "Note 3 changes in the weather."
        },
        gardener: {
          title: isCheckpoint ? "Seasonal Review" : `Growth Ring ${i}`,
          description: isCheckpoint ? "Check the soil quality and hydration." : "Tend to the new sprouts.",
          icon: isCheckpoint ? "🌻" : (i % 2 === 0 ? "💧" : "🌱"),
          challenge: "Find 3 new buds opening."
        }
      }
    });
  }
  return steps;
};

export const contentLibrary = {
  journey: generateSteps()
};