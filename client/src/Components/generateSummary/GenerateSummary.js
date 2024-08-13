export function generateProjectSummaryMarkdown(project){
    console.log(project)
    let pendingTasks =[]
    let completedTasks = []
    project.tasks.forEach(task => {
        if (task.status === 'Completed') {
            completedTasks.push(task);
        } else {
            pendingTasks.push(task);
        }
    });
    
    let markdownContent = `# ${project.title}\n\n`;
    markdownContent += `**Summary:** ${completedTasks.length} / ${project.tasks.length} completed\n\n`;
    
    markdownContent += `## Pending Tasks\n`;
    pendingTasks.forEach(task => {
        markdownContent += `- [ ] ${task.title}\n`;
    });

    markdownContent += `\n## Completed Tasks\n`;
    completedTasks.forEach(task => {
        markdownContent += `- [x] ${task.title}\n`;
    });

    return markdownContent;
}