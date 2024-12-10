import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Task } from '../models/task';


export const getTasks = async (req: Request, res: Response): Promise<void> => {
  const taskRepository = getRepository(Task);
  const tasks = await taskRepository.find();
  res.json(tasks);
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
  const taskRepository = getRepository(Task);
  const { title, description } = req.body;

  if (!title) {
    res.status(400).json({ message: 'Title is required' });
    return;
  }

  const newTask = taskRepository.create({ title, description });
  const savedTask = await taskRepository.save(newTask);
  res.status(201).json(savedTask);
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
    const taskRepository = getRepository(Task);
    const { id } = req.params;
    const { title, description, completed } = req.body;  
    
    const task = await taskRepository.findOneBy({ id });
  
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
  
    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.completed = completed ?? task.completed;
  
    const updatedTask = await taskRepository.save(task);
    res.json(updatedTask);
  };
  

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  const taskRepository = getRepository(Task);
  const { id } = req.params;

  const result = await taskRepository.delete(id);
  if (result.affected === 0) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }

  res.status(204).send();
};
