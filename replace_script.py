import os
import re

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return False

    new_content = content
    new_content = new_content.replace('buildestate.com', 'lqaly.com')
    new_content = new_content.replace('BuildEstate.com', 'Lqaly.com')
    new_content = new_content.replace('BuildEstate', 'Lqaly')
    new_content = new_content.replace('buildestate', 'lqaly')
    new_content = new_content.replace('BUILDESTATE', 'LQALY')

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

ignored_dirs = {'.git', 'node_modules', '.next', 'dist', 'build'}

def process_directory(directory):
    count = 0
    for root, dirs, files in os.walk(directory):
        dirs[:] = [d for d in dirs if d not in ignored_dirs]
        for file in files:
            if file.endswith('.py') or file.endswith('.png') or file.endswith('.jpg') or file.endswith('.jpeg') or file.endswith('.ico'):
                continue
            filepath = os.path.join(root, file)
            if replace_in_file(filepath):
                count += 1
                print(f'Updated: {filepath}')
    print(f'Total files updated: {count}')

if __name__ == '__main__':
    process_directory(r'c:\Users\ferga\OneDrive\Desktop\wcc\Lqaly')
