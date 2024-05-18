import { Manager } from './database/Manager';

const ideaManager = new Manager('data/ideas.db', true);
const categoryManager = new Manager('data/categories.db', true);

/**
 * Custom APIs for renderer
 */
export const api = {
    ideaManager: ideaManager,
    categoryManager: categoryManager
};
