import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    serverTimestamp,
    Timestamp,
    writeBatch
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Goal, Task } from '@/types';

// Get all goals for a user
export const getUserGoals = async (userId: string): Promise<Goal[]> => {
    try {
        const goalsQuery = query(collection(db, 'goals'), where('userId', '==', userId));
        const querySnapshot = await getDocs(goalsQuery);

        const goals: Goal[] = [];
        for (const doc of querySnapshot.docs) {
            const goalData = doc.data();

            // Convert Firestore timestamps to JavaScript dates
            const createdAt = goalData.createdAt?.toDate() || new Date();
            const updatedAt = goalData.updatedAt?.toDate() || new Date();
            const dueDate = goalData.dueDate?.toDate() || undefined;

            // Get tasks for this goal
            const tasks = await getGoalTasks(doc.id);

            goals.push({
                id: doc.id,
                title: goalData.title,
                description: goalData.description || '',
                status: goalData.status,
                dueDate: dueDate,
                tasks: tasks,
                createdAt: createdAt,
                updatedAt: updatedAt
            });
        }

        return goals;
    } catch (error) {
        console.error('Error getting user goals:', error);
        throw error;
    }
};

// Get a single goal by ID
export const getGoalById = async (goalId: string): Promise<Goal | null> => {
    try {
        const goalDoc = await getDoc(doc(db, 'goals', goalId));

        if (!goalDoc.exists()) {
            return null;
        }

        const goalData = goalDoc.data();

        // Convert Firestore timestamps to JavaScript dates
        const createdAt = goalData.createdAt?.toDate() || new Date();
        const updatedAt = goalData.updatedAt?.toDate() || new Date();
        const dueDate = goalData.dueDate?.toDate() || undefined;

        // Get tasks for this goal
        const tasks = await getGoalTasks(goalId);

        return {
            id: goalDoc.id,
            title: goalData.title,
            description: goalData.description || '',
            status: goalData.status,
            dueDate: dueDate,
            tasks: tasks,
            createdAt: createdAt,
            updatedAt: updatedAt
        };
    } catch (error) {
        console.error('Error getting goal by ID:', error);
        throw error;
    }
};

// Create a new goal
export const createGoal = async (userId: string, goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'tasks'>): Promise<string> => {
    try {
        // Prepare the goal data
        const newGoal = {
            ...goalData,
            userId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            dueDate: goalData.dueDate ? Timestamp.fromDate(goalData.dueDate) : null
        };

        // Add the goal to Firestore
        const docRef = await addDoc(collection(db, 'goals'), newGoal);
        return docRef.id;
    } catch (error) {
        console.error('Error creating goal:', error);
        throw error;
    }
};

// Update a goal
export const updateGoal = async (goalId: string, updates: Partial<Omit<Goal, 'id' | 'tasks'>>): Promise<void> => {
    try {
        const goalRef = doc(db, 'goals', goalId);

        // Prepare updates, converting any dates to Firestore timestamps
        const updates2 = {
            ...updates,
            updatedAt: serverTimestamp(),
            dueDate: updates.dueDate ? Timestamp.fromDate(updates.dueDate) : undefined
        };

        await updateDoc(goalRef, updates2);
    } catch (error) {
        console.error('Error updating goal:', error);
        throw error;
    }
};

// Delete a goal and all its tasks
export const deleteGoal = async (goalId: string): Promise<void> => {
    try {
        const batch = writeBatch(db);

        // Delete the goal document
        batch.delete(doc(db, 'goals', goalId));

        // Delete all tasks associated with this goal
        const tasksQuery = query(collection(db, 'tasks'), where('goalId', '==', goalId));
        const taskSnapshot = await getDocs(tasksQuery);

        taskSnapshot.docs.forEach(taskDoc => {
            batch.delete(taskDoc.ref);
        });

        // Commit the batch deletion
        await batch.commit();
    } catch (error) {
        console.error('Error deleting goal:', error);
        throw error;
    }
};

// Get all tasks for a specific goal
export const getGoalTasks = async (goalId: string): Promise<Task[]> => {
    try {
        const tasksQuery = query(collection(db, 'tasks'), where('goalId', '==', goalId));
        const querySnapshot = await getDocs(tasksQuery);

        const tasks: Task[] = [];
        querySnapshot.docs.forEach(doc => {
            const taskData = doc.data();

            // Convert Firestore timestamps to JavaScript dates
            const createdAt = taskData.createdAt?.toDate() || new Date();
            const updatedAt = taskData.updatedAt?.toDate() || new Date();
            const dueDate = taskData.dueDate?.toDate() || undefined;
            const startTime = taskData.startTime?.toDate() || undefined;
            const endTime = taskData.endTime?.toDate() || undefined;

            tasks.push({
                id: doc.id,
                goalId: taskData.goalId,
                title: taskData.title,
                description: taskData.description || '',
                status: taskData.status,
                dueDate: dueDate,
                startTime: startTime,
                endTime: endTime,
                estimatedMinutes: taskData.estimatedMinutes,
                createdAt: createdAt,
                updatedAt: updatedAt
            });
        });

        return tasks;
    } catch (error) {
        console.error('Error getting goal tasks:', error);
        throw error;
    }
};

// Add a new task to a goal
export const addTask = async (goalId: string, taskData: Omit<Task, 'id' | 'goalId' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
        // Prepare the task data
        const newTask = {
            ...taskData,
            goalId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            dueDate: taskData.dueDate ? Timestamp.fromDate(taskData.dueDate) : null,
            startTime: taskData.startTime ? Timestamp.fromDate(taskData.startTime) : null,
            endTime: taskData.endTime ? Timestamp.fromDate(taskData.endTime) : null
        };

        // Add the task to Firestore
        const docRef = await addDoc(collection(db, 'tasks'), newTask);
        return docRef.id;
    } catch (error) {
        console.error('Error adding task:', error);
        throw error;
    }
};

// Update a task
export const updateTask = async (taskId: string, updates: Partial<Omit<Task, 'id' | 'goalId'>>): Promise<void> => {
    try {
        const taskRef = doc(db, 'tasks', taskId);

        // Prepare updates, converting any dates to Firestore timestamps
        const updates2 = {
            ...updates,
            updatedAt: serverTimestamp(),
            dueDate: updates.dueDate ? Timestamp.fromDate(updates.dueDate) : undefined,
            startTime: updates.startTime ? Timestamp.fromDate(updates.startTime) : undefined,
            endTime: updates.endTime ? Timestamp.fromDate(updates.endTime) : undefined
        };

        await updateDoc(taskRef, updates2);
    } catch (error) {
        console.error('Error updating task:', error);
        throw error;
    }
};

// Delete a task
export const deleteTask = async (taskId: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
};

// Complete a task
export const completeTask = async (taskId: string): Promise<void> => {
    try {
        await updateTask(taskId, { status: 'completed' });
    } catch (error) {
        console.error('Error completing task:', error);
        throw error;
    }
}; 