import { NextResponse } from "next/server";

// This is a local Simulation Engine.
// It mimics the AI logic without needing the external connection.

export async function POST(req) {
  // 1. Get the user's message and their current "Vibe"
  const { message, archetype } = await req.json();

  // 2. Simulate "Thinking" delay (1.5 seconds) so it feels real
  await new Promise(resolve => setTimeout(resolve, 1500));

  // 3. Select a response based on the Archetype
  let reply = "";
  
  // Randomizer to keep it fresh
  const randomPick = Math.floor(Math.random() * 3);

  if (archetype === "builder") {
    const builderResponses = [
      "I hear you. Let's look at the blueprints. Where do you feel the structure is weakest right now?",
      "That sounds like a heavy load to carry. Remember, we build the foundation one brick at a time.",
      "Let's get out the tools. If we reinforce your routine this morning, the rest of the day will hold up."
    ];
    reply = builderResponses[randomPick];
  } 
  
  else if (archetype === "explorer") {
    const explorerResponses = [
      "The fog is thick today, isn't it? Let's check the compass. What is one small step you can take North?",
      "You are in uncharted waters. It is okay to drop anchor and rest until the storm passes.",
      "I see that on your map. Let's chart a course around that obstacle rather than crashing into it."
    ];
    reply = explorerResponses[randomPick];
  } 
  
  else if (archetype === "gardener") {
    const gardenerResponses = [
      "Growth takes time. You are trying to force a bloom in winter. Be patient with yourself.",
      "Let's check the soil. Are you getting enough water and sunlight today?",
      "Pruning is painful, but it helps us grow back stronger. What can you cut out of your schedule today?"
    ];
    reply = gardenerResponses[randomPick];
  }

  // 4. Send the simulated response
  return NextResponse.json({ reply: reply });
}