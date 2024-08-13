import { useEffect, useState } from "react";
import { format } from "date-fns";
import { logoutUser } from "./../../services/auth";
import {downloadMarkdownFile} from "../generateSummary/downloadMarkdown"
import {
  getProjects,
  createProject,
  getTasks,
  getTaskById,
  createTask,
  editTask,
  deleteTask,
  editProjectDetails,
  fetchProjectById
} from "./../../services/api";
import Spinner from "./../loading/Spinner";
import { toast } from "react-toastify";
import { generateProjectSummaryMarkdown } from "../generateSummary/GenerateSummary";
import { createGithubGist } from "../generateSummary/Githubgist";

const Home = ({ token, setToken }) => {
  const [projects, setProjects] = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showViewTaskModal, setShowViewTaskModal] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [editTaskDetails, setEditTaskDetails] = useState({
    id: "",
    title: "",
    description: "",
    status: "",
  });
  const statusOptions = ["Pending", "In Progress", "Completed"];
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [editProject, setEditProject] = useState({
    title: "",
    description: "",
  });


  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    setProjects([])
    fetchProjects();
 }, []);

  const handleAddProject = async () => {
    try {
      await createProject(newProject);
      fetchProjects();
      setShowProjectModal(false);
      setNewProject({ title: "", description: "" });
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const handleAddTask = async () => {
    if (currentProject) {
      try {
        await createTask(currentProject.id, newTask);
        fetchTasks(currentProject.id);
        setShowTaskModal(false);
        setNewTask({ title: "", description: "" });
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const fetchTasks = async (projectId) => {
    try {
      const data = await getTasks(projectId);
      setTasks(data);
    } catch (error) {
      console.error(`Error fetching tasks for project ${projectId}:`, error);
    }
  };

  const handleEditTask = async (taskId) => {
    try {
      const task = await getTaskById(taskId, currentProject.id);
      setEditTaskDetails(task);
      setShowEditTaskModal(true);
    } catch (error) {
      console.error(`Error fetching task with ID ${taskId}:`, error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId, currentProject.id);
      fetchTasks(currentProject.id);
    } catch (error) {
      console.error(`Error deleting task with ID ${taskId}:`, error);
    }
  };

  const handleUpdateTask = async () => {
    try {
      await editTask(editTaskDetails.id, editTaskDetails, currentProject.id);
      fetchTasks(currentProject.id);
      setShowEditTaskModal(false);
    } catch (error) {
      console.error(
        `Error updating task with ID ${editTaskDetails.id}:`,
        error
      );
    }
  };

  const handleEditProject = async () => {
    if (currentProject) {
      try {
        await editProjectDetails(currentProject.id, editProject);
        fetchProjects();
        setShowEditProjectModal(false);
      } catch (error) {
        console.error("Error editing project:", error);
      }
    }
  };
  if (loading) {
    return <Spinner />;
  }
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setShowProjectModal(true)}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Add Project
        </button>
        <button
          onClick={() => {
            logoutUser(setToken);
            setCurrentProject(null);
            setProjects([]);
          }}
          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.length > 0 ? (
          projects.map((project) => (
            <div key={project.id} className="bg-white shadow-lg rounded-lg p-4">
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <button
                onClick={() => {
                  setEditProject({
                    title: project.title,
                    description: project.description,
                  });
                  setCurrentProject(project);
                  setShowEditProjectModal(true);
                }}
                className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition mr-2"
              >
                Edit Project
              </button>
              <button
                onClick={() => {
                  setCurrentProject(project);
                  setShowTaskModal(true);
                  fetchTasks(project.id);
                }}
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition mr-2"
              >
                ADD Tasks
              </button>
              <button
                onClick={() => {
                  setCurrentProject(project);
                  fetchTasks(project.id);
                  setShowViewTaskModal(true);
                }}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
              >
                View Tasks
              </button>
            </div>
          ))
        ) : (
          <p>No Projects to display</p>
        )}
      </div>

      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Add Project</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) =>
                    setNewProject({ ...newProject, title: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </form>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowProjectModal(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition mr-2"
              >
                Close
              </button>
              <button
                onClick={handleAddProject}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Edit Project</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={editProject.title}
                  onChange={(e) =>
                    setEditProject({ ...editProject, title: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={editProject.description}
                  onChange={(e) =>
                    setEditProject({
                      ...editProject,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </form>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowEditProjectModal(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition mr-2"
              >
                Close
              </button>
              <button
                onClick={handleEditProject}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Add Task</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  required
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </form>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowTaskModal(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition mr-2"
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (newTask.title === "") {
                    toast.warning("Please enter the title");
                  } else if (newTask.description === "") {
                    toast.warning("Please enter the description");
                  } else {
                    handleAddTask();
                  }
                }}
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showViewTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[800px]">
            <div className="flex justify-between items-cente">
              <h2 className="text-2xl font-bold mb-4 w-60">
                Title: {currentProject.title}
              </h2>
              <button
              className="rounded border-b-2 w-[180px] bg-gray-500 text-white hover:bg-gray-700"
                onClick={async () => {
                  const project = await fetchProjectById(currentProject.id);
                  const markdownContent = generateProjectSummaryMarkdown(project);
                    downloadMarkdownFile(markdownContent, project.title);
                    const gistUrl = await createGithubGist(
                      markdownContent,
                      project.title,
                    );
                  toast.success(`Gist created! View it at ${gistUrl}`);
                }}
              >
                Export Summary to Gist
              </button>
            </div>
            <h2 className="mb-4">
              Description - <p className="font-thin inline">{currentProject.description}</p>
            </h2>
            <button
                onClick={() => {
                  setEditProject({
                    title: currentProject.title,
                    description: currentProject.description,
                  });
                  setShowEditProjectModal(true);
                  setShowViewTaskModal(false)
                }}
                className="bg-yellow-500 mb-4 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition mr-2"
              >
                Edit Project
              </button>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold mb-4">Tasks</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.length > 0 ? (
                    tasks.map((task) => (
                      <tr key={task.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {task.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {task.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {task.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {task.status}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(task.createdAt, "dd/MM/yyyy")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => handleEditTask(task.id)}
                            className="text-blue-500 hover:text-blue-700 mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No tasks available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowViewTaskModal(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[700px]">
            <h2 className="text-2xl font-bold mb-4">
              Edit Task{editTaskDetails.title}
            </h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={editTaskDetails.title}
                  onChange={(e) =>
                    setEditTaskDetails({
                      ...editTaskDetails,
                      title: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={editTaskDetails.description}
                  onChange={(e) =>
                    setEditTaskDetails({
                      ...editTaskDetails,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Status</label>
                <select
                  value={editTaskDetails.status}
                  onChange={(e) =>
                    setEditTaskDetails({
                      ...editTaskDetails,
                      status: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </form>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowEditTaskModal(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition mr-2"
              >
                Close
              </button>
              <button
                onClick={handleUpdateTask}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Home;
