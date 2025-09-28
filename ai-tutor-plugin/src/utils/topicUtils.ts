// =============================================================================
// TOPIC UTILITIES
// =============================================================================

import { Topic } from '../types';
import { DEFAULT_TOPICS } from '../constants';

export function createTopic(
  id: string,
  name: string,
  path: string,
  icon: any,
  description: string
): Topic {
  return {
    id,
    name,
    path,
    icon,
    description
  };
}

export function validateTopic(topic: Topic): boolean {
  return !!(
    topic.id &&
    topic.name &&
    topic.path &&
    topic.icon &&
    topic.description
  );
}

export function getTopicById(id: string): Topic | undefined {
  return DEFAULT_TOPICS.find(topic => topic.id === id);
}

export function getTopicByPath(path: string): Topic | undefined {
  return DEFAULT_TOPICS.find(topic => topic.path === path);
}

export function getAllTopics(): Topic[] {
  return DEFAULT_TOPICS;
}

export function getTopicsByCategory(category: string): Topic[] {
  return DEFAULT_TOPICS.filter(topic => 
    topic.path.includes(category.toLowerCase())
  );
}
