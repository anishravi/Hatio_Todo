import axios from 'axios';

export async function createGithubGist(markdownContent, projectTitle) {
    const token = 'YOUR_GITHUB_TOKEN';
    const gistData = {
        description: `Summary for project ${projectTitle}`,
        public: false,
        files: {
            [`${projectTitle}.md`]: {
                content: markdownContent
            }
        }
    };

    try {
        const response = await axios.post('https://api.github.com/gists', gistData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.html_url;
    } catch (error) {
        console.error('Error creating gist:', error);
        throw error;
    }
}
