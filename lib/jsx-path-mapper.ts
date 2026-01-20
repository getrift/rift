/**
 * JSX Path Mapper
 * Maps DOM paths (like [0, 1, 2]) to source code positions
 * Used for delete/duplicate operations
 */

export interface JSXNode {
  type: 'element' | 'fragment' | 'expression' | 'text';
  tag?: string;
  start: number;      // Start position in source
  end: number;        // End position in source
  children: JSXNode[];
  path: number[];     // DOM path to this node
  selfClosing?: boolean;
}

interface ParserState {
  code: string;
  pos: number;
  path: number[];
}

/**
 * Parse JSX and build a tree with position information
 * This is a simplified parser that handles common JSX patterns
 */
export function parseJSX(code: string): JSXNode | null {
  // Find the return statement's JSX
  const returnMatch = code.match(/return\s*\(\s*/);
  if (!returnMatch) {
    // Try without parens: return <div>
    const returnMatch2 = code.match(/return\s+(?=<)/);
    if (!returnMatch2) return null;
  }
  
  const state: ParserState = {
    code,
    pos: 0,
    path: [],
  };
  
  // Find the first < after return
  const returnIndex = code.search(/return\s*\(?/);
  if (returnIndex === -1) return null;
  
  // Move to after 'return' and optional '('
  state.pos = returnIndex;
  skipWhitespace(state);
  if (code.slice(state.pos, state.pos + 6) === 'return') {
    state.pos += 6;
  }
  skipWhitespace(state);
  if (code[state.pos] === '(') {
    state.pos++;
  }
  skipWhitespace(state);
  
  if (code[state.pos] !== '<') {
    return null;
  }
  
  return parseElement(state, []);
}

function skipWhitespace(state: ParserState): void {
  while (state.pos < state.code.length && /\s/.test(state.code[state.pos])) {
    state.pos++;
  }
}

function parseElement(state: ParserState, path: number[]): JSXNode | null {
  const start = state.pos;
  
  if (state.code[state.pos] !== '<') {
    return null;
  }
  state.pos++; // skip <
  
  // Check for fragment <>
  if (state.code[state.pos] === '>') {
    state.pos++; // skip >
    return parseFragment(state, start, path);
  }
  
  // Check for closing tag
  if (state.code[state.pos] === '/') {
    return null; // This is a closing tag, handled by parent
  }
  
  // Parse tag name
  const tagStart = state.pos;
  while (state.pos < state.code.length && /[A-Za-z0-9_.]/.test(state.code[state.pos])) {
    state.pos++;
  }
  const tag = state.code.slice(tagStart, state.pos);
  
  if (!tag) {
    return null;
  }
  
  // Skip attributes
  skipAttributes(state);
  skipWhitespace(state);
  
  // Check for self-closing />
  if (state.code.slice(state.pos, state.pos + 2) === '/>') {
    state.pos += 2;
    return {
      type: 'element',
      tag,
      start,
      end: state.pos,
      children: [],
      path,
      selfClosing: true,
    };
  }
  
  // Expect >
  if (state.code[state.pos] !== '>') {
    return null;
  }
  state.pos++; // skip >
  
  // Parse children
  const children: JSXNode[] = [];
  let childIndex = 0;
  
  while (state.pos < state.code.length) {
    skipWhitespace(state);
    
    // Check for closing tag
    if (state.code.slice(state.pos, state.pos + 2) === '</') {
      // Found closing tag
      state.pos += 2;
      
      // Skip tag name
      while (state.pos < state.code.length && /[A-Za-z0-9_.]/.test(state.code[state.pos])) {
        state.pos++;
      }
      skipWhitespace(state);
      
      if (state.code[state.pos] === '>') {
        state.pos++;
      }
      
      return {
        type: 'element',
        tag,
        start,
        end: state.pos,
        children,
        path,
        selfClosing: false,
      };
    }
    
    // Parse child element
    if (state.code[state.pos] === '<') {
      const child = parseElement(state, [...path, childIndex]);
      if (child) {
        children.push(child);
        childIndex++;
      } else {
        break;
      }
    } else if (state.code[state.pos] === '{') {
      // Expression child - skip it for now (doesn't contribute to DOM path for element selection)
      const exprChild = parseExpression(state, [...path, childIndex]);
      if (exprChild) {
        // Only count as child if it renders elements (like map)
        // For simple expressions like {value}, skip incrementing childIndex
        // This is a simplification - proper handling would need runtime analysis
        if (exprChild.type === 'expression') {
          // Check if it looks like a .map() call which renders children
          const exprCode = state.code.slice(exprChild.start, exprChild.end);
          if (exprCode.includes('.map(')) {
            children.push(exprChild);
            childIndex++;
          }
        }
      }
    } else if (state.code[state.pos] && state.code[state.pos] !== '<' && state.code[state.pos] !== '{') {
      // Text content - skip
      while (state.pos < state.code.length && 
             state.code[state.pos] !== '<' && 
             state.code[state.pos] !== '{') {
        state.pos++;
      }
    } else {
      break;
    }
  }
  
  return {
    type: 'element',
    tag,
    start,
    end: state.pos,
    children,
    path,
    selfClosing: false,
  };
}

function parseFragment(state: ParserState, start: number, path: number[]): JSXNode {
  const children: JSXNode[] = [];
  let childIndex = 0;
  
  while (state.pos < state.code.length) {
    skipWhitespace(state);
    
    // Check for closing fragment </>
    if (state.code.slice(state.pos, state.pos + 3) === '</>') {
      state.pos += 3;
      return {
        type: 'fragment',
        start,
        end: state.pos,
        children,
        path,
      };
    }
    
    if (state.code[state.pos] === '<') {
      const child = parseElement(state, [...path, childIndex]);
      if (child) {
        children.push(child);
        childIndex++;
      } else {
        break;
      }
    } else if (state.code[state.pos] === '{') {
      const exprChild = parseExpression(state, [...path, childIndex]);
      if (exprChild) {
        const exprCode = state.code.slice(exprChild.start, exprChild.end);
        if (exprCode.includes('.map(')) {
          children.push(exprChild);
          childIndex++;
        }
      }
    } else {
      state.pos++;
    }
  }
  
  return {
    type: 'fragment',
    start,
    end: state.pos,
    children,
    path,
  };
}

function parseExpression(state: ParserState, path: number[]): JSXNode | null {
  if (state.code[state.pos] !== '{') return null;
  
  const start = state.pos;
  let depth = 0;
  
  while (state.pos < state.code.length) {
    const char = state.code[state.pos];
    if (char === '{') depth++;
    else if (char === '}') {
      depth--;
      if (depth === 0) {
        state.pos++;
        return {
          type: 'expression',
          start,
          end: state.pos,
          children: [],
          path,
        };
      }
    }
    // Handle string literals to avoid counting braces inside strings
    else if (char === '"' || char === "'" || char === '`') {
      const quote = char;
      state.pos++;
      while (state.pos < state.code.length) {
        if (state.code[state.pos] === '\\') {
          state.pos += 2;
        } else if (state.code[state.pos] === quote) {
          break;
        } else {
          state.pos++;
        }
      }
    }
    state.pos++;
  }
  
  return null;
}

function skipAttributes(state: ParserState): void {
  while (state.pos < state.code.length) {
    skipWhitespace(state);
    
    // Check for end of tag
    if (state.code[state.pos] === '>' || state.code.slice(state.pos, state.pos + 2) === '/>') {
      break;
    }
    
    // Parse attribute name
    const attrStart = state.pos;
    while (state.pos < state.code.length && /[A-Za-z0-9_-]/.test(state.code[state.pos])) {
      state.pos++;
    }
    
    if (state.pos === attrStart) {
      // No attribute name found, might be spread {...props}
      if (state.code[state.pos] === '{') {
        skipBraces(state);
        continue;
      }
      break;
    }
    
    skipWhitespace(state);
    
    // Check for = and value
    if (state.code[state.pos] === '=') {
      state.pos++;
      skipWhitespace(state);
      
      // Parse attribute value
      if (state.code[state.pos] === '"' || state.code[state.pos] === "'") {
        const quote = state.code[state.pos];
        state.pos++;
        while (state.pos < state.code.length && state.code[state.pos] !== quote) {
          if (state.code[state.pos] === '\\') state.pos++;
          state.pos++;
        }
        if (state.code[state.pos] === quote) state.pos++;
      } else if (state.code[state.pos] === '{') {
        skipBraces(state);
      }
    }
  }
}

function skipBraces(state: ParserState): void {
  if (state.code[state.pos] !== '{') return;
  
  let depth = 0;
  while (state.pos < state.code.length) {
    const char = state.code[state.pos];
    if (char === '{') depth++;
    else if (char === '}') {
      depth--;
      if (depth === 0) {
        state.pos++;
        return;
      }
    }
    // Handle strings
    else if (char === '"' || char === "'" || char === '`') {
      const quote = char;
      state.pos++;
      while (state.pos < state.code.length) {
        if (state.code[state.pos] === '\\') {
          state.pos += 2;
        } else if (state.code[state.pos] === quote) {
          break;
        } else {
          state.pos++;
        }
      }
    }
    state.pos++;
  }
}

/**
 * Find a JSX node by its DOM path
 */
export function findNodeByPath(root: JSXNode, path: number[]): JSXNode | null {
  if (path.length === 0) {
    return root;
  }
  
  let current = root;
  for (const index of path) {
    if (!current.children || index >= current.children.length) {
      return null;
    }
    current = current.children[index];
  }
  
  return current;
}

/**
 * Find the deepest JSX element that contains a given character position
 * Returns the path to that element, or null if not found
 */
export function findPathAtPosition(code: string, position: number): number[] | null {
  const root = parseJSX(code);
  if (!root) return null;
  
  function findDeepest(node: JSXNode): JSXNode | null {
    // Check if position is within this node
    if (position < node.start || position > node.end) {
      return null;
    }
    
    // Check children for a more specific match
    for (const child of node.children) {
      const deeper = findDeepest(child);
      if (deeper) return deeper;
    }
    
    // This node contains the position and no child does
    return node;
  }
  
  const found = findDeepest(root);
  return found ? found.path : null;
}

/**
 * Delete a JSX element from the source code
 * Returns the modified code
 */
export function deleteElement(code: string, path: number[]): string {
  const root = parseJSX(code);
  if (!root) return code;
  
  const node = findNodeByPath(root, path);
  if (!node) return code;
  
  // Remove the element and any trailing whitespace/newline
  let end = node.end;
  while (end < code.length && /[\s]/.test(code[end]) && code[end] !== '\n') {
    end++;
  }
  // Also remove one newline if present
  if (code[end] === '\n') {
    end++;
  }
  
  // Check for leading whitespace on the same line
  let start = node.start;
  while (start > 0 && code[start - 1] === ' ') {
    start--;
  }
  
  return code.slice(0, start) + code.slice(end);
}

/**
 * Duplicate a JSX element in the source code
 * Returns the modified code
 */
export function duplicateElement(code: string, path: number[]): string {
  const root = parseJSX(code);
  if (!root) return code;
  
  const node = findNodeByPath(root, path);
  if (!node) return code;
  
  // Get the element text
  const elementText = code.slice(node.start, node.end);
  
  // Find proper indentation
  let lineStart = node.start;
  while (lineStart > 0 && code[lineStart - 1] !== '\n') {
    lineStart--;
  }
  const indent = code.slice(lineStart, node.start);
  
  // Insert duplicate after the original
  const insertion = '\n' + indent + elementText;
  
  return code.slice(0, node.end) + insertion + code.slice(node.end);
}
