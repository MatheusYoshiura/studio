"use client";

import type { Task, Subtask } from "@/lib/types";
import { TaskItem } from "./TaskItem";
import { AnimatePresence, motion } from "framer-motion";

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleTaskStatus: (taskId: string, currentStatus: Task["status"]) => void;
  onAddSubtask: (parentId: string, subtaskData: Omit<Subtask, "id" | "createdAt">) => void;
  onDeleteSubtask: (parentId: string, subtaskId: string) => void;
  onEditSubtask: (parentId: string, subtaskData: Subtask) => void;
}

export function TaskList({ 
  tasks, 
  onEditTask, 
  onDeleteTask, 
  onToggleTaskStatus,
  onAddSubtask,
  onDeleteSubtask,
  onEditSubtask 
}: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="text-center text-muted-foreground py-8">Nenhuma tarefa encontrada. Que tal criar uma nova?</p>;
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            layout // Enables smooth reordering if tasks array changes order
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <TaskItem
              task={task}
              onEdit={() => onEditTask(task)}
              onDelete={() => onDeleteTask(task.id)}
              onToggleStatus={() => onToggleTaskStatus(task.id, task.status)}
              onAddSubtask={onAddSubtask}
              onDeleteSubtask={onDeleteSubtask}
              onEditSubtask={onEditSubtask}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
