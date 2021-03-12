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
{__                                         {__                             
{__                                         {__                             
{__      {__  {__{___ {__ {__ {_ {__        {__  {__   {__    {__   {__     
{__ {__  {__  {__ {__  {_  {__{_  {__ {_____{__ {__  {_   {__  {__ {__      
{__   {__{__  {__ {__  {_  {__{_   {__      {_{__   {_____ {__   {___       
{__   {__{__  {__ {__  {_  {__{__ {__       {__ {__ {_            {__       
{__ {__    {__{__{___  {_  {__{__           {__  {__  {____      {__        
                              {__                              {__          
`