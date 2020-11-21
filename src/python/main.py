import json
import sys, os
from os.path import join, dirname, abspath
from summary_analysis import get_conversations_summary
from analyze_emotion import get_analyzed_emotions
import math

def log_progress(generator, total):
    percent=-1
    for i in range(total):
        new_percent = math.floor(100*(i+1)/total)
        if new_percent > percent :
            percent = new_percent
            fname = join(dirname(abspath(__file__)), 'progress.txt')

            with open(fname, 'w') as progress_file:
                progress_file.write(str(percent))

        yield next(generator)

def execute_operation(ope_name, messages_path, output_path, *args):
    generator=None
    if ope_name=='build_summary':
        generator, size = get_conversations_summary(os.path.join(messages_path, 'inbox'))
    elif ope_name=='message_emotion_ranking':
        try:
            conv_id = args[0]
        except IndexError:
            print(f'Missing parameter : conversation id', file=sys.stderr)
            sys.exit(1)
        generator, size = get_analyzed_emotions(join(messages_path, 'inbox', conv_id))
    else:
        print(f'Unknown operation : {ope_name}', file=sys.stderr)
        sys.exit(1)
    with open(output_path, 'w') as output_file:
        json.dump([e for e in log_progress(generator, size)], output_file)

if __name__ == '__main__':
    ope_name = sys.argv[1]
    messages_path = sys.argv[2]
    output_path = sys.argv[3]
    args = sys.argv[4:]
    output_dir = os.path.dirname(output_path)
    if not  os.path.isdir(output_dir):
        os.makedirs(output_dir)
    print(f'message path : {messages_path}')
    print(f'output path : {output_path}')
    execute_operation(ope_name, messages_path, output_path, *args)