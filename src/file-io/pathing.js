import * as path from 'path';
import { FILES } from "../constants";

export const buildPath = (root, file) => {
    return path.join(root, file);
};