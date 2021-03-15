import path from 'path';

export const FILES = {
    PACKAGE: "package.json",
    YARNLOCK: "yarn.lock",
    PACKAGELOCK: "package-lock.json"
}

export const BUMP = {
    'major': 'major',
    'minor': 'minor',
    'patch': 'patch',
    'null': 'null',
    'nonSemver': 'nonSemver'
}

export const PATHS = {
    'bin': path.join(process.cwd(), 'node_modules/.bin')
}

export const BANNER = `
                                           ..     
                                      ;c:;;ldl;.  
                                   .,cxl.  'dOko. 
.:,...........;;.':;...........'::';xxl:;..,d0kx:.
,o:,,''',,''';lc,;ol,,,,,,'''',;ol';xxc::,.,dOkkl.
    ......                        .':okl.  .oOkx, 
    ......                           .:l:;;lxxl'  
    '.  ..                            .....''.    
    '.  ..                                        
`