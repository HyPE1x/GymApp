export const generateTips = (routine_day, exercises) => {
    const tips = []

    const muscleGroupsHit = exercises.map(ex => ex.muscle_group)
    const muscleHeadsHit = exercises.map(ex => ex.muscle_head)

    if(exercises.length === 0){
        tips.push("Edit the day to add exercises.");
        return tips;
    }

    //tips for Push day
    if(routine_day === 'Push'){
        if(!muscleHeadsHit.includes("Compound")) {
            tips.push("Include a compound workout such as any Flat Bench Press or Dips to work your full chest as well as shoulders and triceps");
        }
        if(muscleGroupsHit.filter(group => group === "Chest").length < 3) {
            tips.push("Consider increasing your Chest volume");
        }
        if(muscleGroupsHit.filter(group => group === "Chest").length > 4) {
            tips.push("Consider reducing your Chest volume");
        }
        if(!muscleHeadsHit.includes("Upper Chest")) {
            tips.push("Add an Upper Chest focused Chest Exercise");
        }
        const flyKeywords = ["Fly", "Pec Dec"];
        const hasFlyVariation = exercises.some(exercise => flyKeywords.some(keyword => exercise.exercise_name.includes(keyword)));
        if(!hasFlyVariation){
            tips.push("Consider including a Fly Chest exercise (e.g., Pec Dec or Seated Cable Fly)");
        }
        if(muscleGroupsHit.filter(group => group === "Shoulders").length < 2) {
            tips.push("Consider increasing your Shoulder volume");
        }
        if(muscleGroupsHit.filter(group => group === "Shoulders").length > 3) {
            tips.push("Consider reducing your Shoulder volume");
        }
        if(!muscleHeadsHit.includes("Front Delt")) {
            tips.push("Add a Front Delt focused Shoulder Exercise such as any Overhead Press");
        }
        if(!muscleHeadsHit.includes("Side Delt")) {
            tips.push("Add a Side Delt focused Shoulder Exercise such as any Lateral Raise");
        }
        if(muscleGroupsHit.filter(group => group === "Triceps").length < 2) {
            tips.push("Consider increasing your Triceps volume");
        }
        if(muscleGroupsHit.filter(group => group === "Triceps").length > 3) {
            tips.push("Consider reducing your Triceps volume");
        }
        if(!muscleHeadsHit.includes("Long Head")) {
            tips.push("Add a Long Head focused Triceps Exercise such as any Overhead Extension");
        }
        if(!muscleHeadsHit.includes("Medial and Lateral Head")) {
            tips.push("Consider adding a Pushdown-type Triceps Exercise to work on the Medial and Lateral Head");
        }
    }

    //tips for Pull day
    if(routine_day === 'Pull'){
        if(muscleGroupsHit.filter(group => group === "Back").length < 3) {
            tips.push("Consider increasing your Back volume");
        }
        if(muscleGroupsHit.filter(group => group === "Back").length > 4) {
            tips.push("Consider reducing your Back volume");
        }
        const verticalKeywords = ["Pull-Up", "Pull-Down"];
        const hasVerticalPull = exercises.some(exercise => verticalKeywords.some(keyword => exercise.exercise_name.includes(keyword)));
        if(!hasVerticalPull) {
            tips.push("Add a Vertical Pull exercise such a Pull-Up or Pulldown");
        }
        const hasHorizontalPull = exercises.some(exercise => ["Row"].some(keyword => exercise.exercise_name.includes(keyword)));
        if(!hasHorizontalPull) {
            tips.push("Add a Horizontal Pull exercise such as any Row");
        }
        if(muscleGroupsHit.filter(group => group === "Biceps").length < 2) {
            tips.push("Consider increasing your Biceps volume");
        }
        if(muscleGroupsHit.filter(group => group === "Biceps").length > 3) {
            tips.push("Consider reducing your Biceps volume");
        }
        if(!muscleHeadsHit.includes("Long and Short Head") && !muscleHeadsHit.includes("Short Head") && !muscleHeadsHit.includes("Long Head")) {
            tips.push("Add Curl exercises to target the Long and Short Head of the biceps");
        }
        if(muscleHeadsHit.includes("Short Head") && !muscleHeadsHit.includes("Long Head") && !muscleHeadsHit.includes("Long and Short Head")) {
            tips.push("Include a Long Head isolation Bicep exercise");
        }
        if(muscleHeadsHit.includes("Long Head") && !muscleHeadsHit.includes("Short Head") && !muscleHeadsHit.includes("Long and Short Head")) {
            tips.push("Include a Short Head isolation Bicep exercise");
        }
        if(!muscleHeadsHit.includes("Brachialis and Brachioradialis")) {
            tips.push("Add a Hammer Curl variation to target the Brachialis and Brachioradialis");
        }
    }

    //tips for Leg day
    if(routine_day === 'Legs'){
        const hasSquat = exercises.some(exercise => ["Squat"].some(keyword => exercise.exercise_name.includes(keyword)));
        if(!hasSquat) {
            tips.push("Consider adding a compound Squat exercise");
        }
        if(muscleGroupsHit.filter(group => group === "Quads").length < 2) {
            tips.push("Consider increasing your Quad volume");
        }
        if(muscleGroupsHit.filter(group => group === "Quads").length > 4) {
            tips.push("Consider decreasing your Quad volume");
        }
        if(muscleGroupsHit.filter(group => group === "Glutes").length < 1) {
            tips.push("Consider adding a Glute exercise");
        }
        const hasAdduction = exercises.some(exercise => ["Adduction"].some(keyword => exercise.exercise_name.includes(keyword)));
        const hasAbduction = exercises.some(exercise => ["Abduction"].some(keyword => exercise.exercise_name.includes(keyword)));
        if(hasAdduction && !hasAbduction){
            tips.push("Consider also adding a Hip Abduction exercise");
        }
        if(!hasAdduction && hasAbduction){
            tips.push("Consider also adding a Hip Adduction exercise");
        }
        if(muscleGroupsHit.filter(group => group === "Hamstring").length < 1) {
            tips.push("Add a Hamstring isolation exercise");
        }
        if(muscleGroupsHit.filter(group => group === "Calf").length < 1) {
            tips.push("Add a Calf Raise variation");
        }
    }

    //tips for Chest-Back
    if(routine_day === 'Chest-Back') {
        if(!muscleHeadsHit.includes("Compound")) {
            tips.push("Include a compound workout such as any Flat Chest Press and Pull-Ups");
        }
        if(muscleGroupsHit.filter(group => group === "Chest").length < 3) {
            tips.push("Consider increasing your Chest volume");
        }
        if(muscleGroupsHit.filter(group => group === "Chest").length > 4) {
            tips.push("Consider reducing your Chest volume");
        }
        if(!muscleHeadsHit.includes("Upper Chest")) {
            tips.push("Add an Upper Chest focused Chest Exercise");
        }
        const flyKeywords = ["Fly", "Pec Dec"];
        const hasFlyVariation = exercises.some(exercise => flyKeywords.some(keyword => exercise.exercise_name.includes(keyword)));
        if(!hasFlyVariation){
            tips.push("Consider including a Fly Chest exercise (e.g., Pec Dec or Seated Cable Fly)");
        }
        if(muscleGroupsHit.filter(group => group === "Back").length < 3) {
            tips.push("Consider increasing your Back volume");
        }
        if(muscleGroupsHit.filter(group => group === "Back").length > 4) {
            tips.push("Consider reducing your Back volume");
        }
        const verticalKeywords = ["Pull-Up", "Pull-Down"];
        const hasVerticalPull = exercises.some(exercise => verticalKeywords.some(keyword => exercise.exercise_name.includes(keyword)));
        if(!hasVerticalPull) {
            tips.push("Add a Vertical Pull exercise such a Pull-Up or Pulldown");
        }
        const hasHorizontalPull = exercises.some(exercise => ["Row"].some(keyword => exercise.exercise_name.includes(keyword)));
        if(!hasHorizontalPull) {
            tips.push("Add a Horizontal Pull exercise such as any Row");
        }
    }

    //tips for Shoulders-Arms
    if(routine_day === 'Shoulders-Arms') {
        if(muscleGroupsHit.filter(group => group === "Shoulders").length < 2) {
            tips.push("Consider increasing your Shoulder volume");
        }
        if(muscleGroupsHit.filter(group => group === "Shoulders").length > 3) {
            tips.push("Consider reducing your Shoulder volume");
        }
        if(!muscleHeadsHit.includes("Front Delt")) {
            tips.push("Add a Front Delt focused Shoulder Exercise such as any Overhead Press");
        }
        if(!muscleHeadsHit.includes("Side Delt")) {
            tips.push("Add a Side Delt focused Shoulder Exercise such as any Lateral Raise");
        }
        if(muscleGroupsHit.filter(group => group === "Triceps").length < 2) {
            tips.push("Consider increasing your Triceps volume");
        }
        if(muscleGroupsHit.filter(group => group === "Triceps").length > 3) {
            tips.push("Consider reducing your Triceps volume");
        }
        if(!muscleHeadsHit.includes("Long Head")) {
            tips.push("Add a Long Head focused Triceps Exercise such as any Overhead Extension");
        }
        if(!muscleHeadsHit.includes("Medial and Lateral Head")) {
            tips.push("Consider adding a Pushdown-type Triceps Exercise to work on the Medial and Lateral Head");
        }
        if(muscleGroupsHit.filter(group => group === "Biceps").length < 2) {
            tips.push("Consider increasing your Biceps volume");
        }
        if(muscleGroupsHit.filter(group => group === "Biceps").length > 3) {
            tips.push("Consider reducing your Biceps volume");
        }
        if(!muscleHeadsHit.includes("Long and Short Head") && !muscleHeadsHit.includes("Short Head") && !muscleHeadsHit.includes("Long Head")) {
            tips.push("Add Curl exercises to target the Long and Short Head of the biceps");
        }
        if(muscleHeadsHit.includes("Short Head") && !muscleHeadsHit.includes("Long Head") && !muscleHeadsHit.includes("Long and Short Head")) {
            tips.push("Include a Long Head isolation Bicep exercise");
        }
        if(muscleHeadsHit.includes("Long Head") && !muscleHeadsHit.includes("Short Head") && !muscleHeadsHit.includes("Long and Short Head")) {
            tips.push("Include a Short Head isolation Bicep exercise");
        }
        if(!muscleHeadsHit.includes("Brachialis and Brachioradialis")) {
            tips.push("Add a Hammer Curl variation to target the Brachialis and Brachioradialis");
        }
    }

    //tips for Chest-Shoulders
    if(routine_day === 'Chest-Shoulders'){
        if(!muscleHeadsHit.includes("Compound")) {
            tips.push("Include a compound workout such as any Flat Bench Press or Dips to work your full chest as well as shoulders");
        }
        if(muscleGroupsHit.filter(group => group === "Chest").length < 3) {
            tips.push("Consider increasing your Chest volume");
        }
        if(muscleGroupsHit.filter(group => group === "Chest").length > 4) {
            tips.push("Consider reducing your Chest volume");
        }
        if(!muscleHeadsHit.includes("Upper Chest")) {
            tips.push("Add an Upper Chest focused Chest Exercise");
        }
        const flyKeywords = ["Fly", "Pec Dec"];
        const hasFlyVariation = exercises.some(exercise => flyKeywords.some(keyword => exercise.exercise_name.includes(keyword)));
        if(!hasFlyVariation){
            tips.push("Consider including a Fly Chest exercise (e.g., Pec Dec or Seated Cable Fly)");
        }
        if(muscleGroupsHit.filter(group => group === "Shoulders").length < 2) {
            tips.push("Consider increasing your Shoulder volume");
        }
        if(muscleGroupsHit.filter(group => group === "Shoulders").length > 3) {
            tips.push("Consider reducing your Shoulder volume");
        }
        if(!muscleHeadsHit.includes("Front Delt")) {
            tips.push("Add a Front Delt focused Shoulder Exercise such as any Overhead Press");
        }
        if(!muscleHeadsHit.includes("Side Delt")) {
            tips.push("Add a Side Delt focused Shoulder Exercise such as any Lateral Raise");
        }
    }

    //tips for Back
    if(routine_day === 'Back'){
        if(muscleGroupsHit.filter(group => group === "Back").length < 3) {
            tips.push("Consider increasing your Back volume");
        }
        if(muscleGroupsHit.filter(group => group === "Back").length > 4) {
            tips.push("Consider reducing your Back volume");
        }
        const verticalKeywords = ["Pull-Up", "Pull-Down"];
        const hasVerticalPull = exercises.some(exercise => verticalKeywords.some(keyword => exercise.exercise_name.includes(keyword)));
        if(!hasVerticalPull) {
            tips.push("Add a Vertical Pull exercise such a Pull-Up or Pulldown");
        }
        const hasHorizontalPull = exercises.some(exercise => ["Row"].some(keyword => exercise.exercise_name.includes(keyword)));
        if(!hasHorizontalPull) {
            tips.push("Add a Horizontal Pull exercise such as any Row");
        }
    }

    if(routine_day === 'Arms'){
        if(muscleGroupsHit.filter(group => group === "Triceps").length < 2) {
            tips.push("Consider increasing your Triceps volume");
        }
        if(muscleGroupsHit.filter(group => group === "Triceps").length > 3) {
            tips.push("Consider reducing your Triceps volume");
        }
        if(!muscleHeadsHit.includes("Long Head")) {
            tips.push("Add a Long Head focused Triceps Exercise such as any Overhead Extension");
        }
        if(!muscleHeadsHit.includes("Medial and Lateral Head")) {
            tips.push("Consider adding a Pushdown-type Triceps Exercise to work on the Medial and Lateral Head");
        }
        if(muscleGroupsHit.filter(group => group === "Biceps").length < 2) {
            tips.push("Consider increasing your Biceps volume");
        }
        if(muscleGroupsHit.filter(group => group === "Biceps").length > 3) {
            tips.push("Consider reducing your Biceps volume");
        }
        if(!muscleHeadsHit.includes("Long and Short Head") && !muscleHeadsHit.includes("Short Head") && !muscleHeadsHit.includes("Long Head")) {
            tips.push("Add Curl exercises to target the Long and Short Head of the biceps");
        }
        if(muscleHeadsHit.includes("Short Head") && !muscleHeadsHit.includes("Long Head") && !muscleHeadsHit.includes("Long and Short Head")) {
            tips.push("Include a Long Head isolation Bicep exercise");
        }
        if(muscleHeadsHit.includes("Long Head") && !muscleHeadsHit.includes("Short Head") && !muscleHeadsHit.includes("Long and Short Head")) {
            tips.push("Include a Short Head isolation Bicep exercise");
        }
        if(!muscleHeadsHit.includes("Brachialis and Brachioradialis")) {
            tips.push("Add a Hammer Curl variation to target the Brachialis and Brachioradialis");
        }
    }

    return tips;
}