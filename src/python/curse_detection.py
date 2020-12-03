import re
import unicodedata
from collections import Counter
from os.path import dirname, join
from analyze_emotion import load_message_data
from fix_messages import fix_text, fix_message, fix_object
from tqdm import tqdm
from functools import reduce

def concat_matches(a, b):
    return {"matches": a['matches']+b['matches']}
def get_message_for_author(author, messages):
    return [m for m in messages if m['sender_name']==author and 'content' in m]
    
def score_curse(messages_path):
    messages = load_message_data(messages_path)
    curse_file = join(dirname(__file__), 'fr_curse.txt')
    curses = []
    with open(curse_file, 'r') as f:
        curses = f.readlines()
    curses = [remove_accents(c.replace('\n', '')) for c in curses if c != '\n']
    curse_pattern = '('+'|'.join([f'\\b{curse}s?\\b' for curse in curses])+')'
    cursing_messages = []
    for message in tqdm([m for m in messages if 'content' in m]) :
        matches = re.findall(curse_pattern, remove_accents(fix_text(message['content'])),flags=re.IGNORECASE)
        if matches:
            cursing_messages.append({'message' : message, 'matches' : matches})
    participants = set([m['message']['sender_name'] for m in cursing_messages])
    swears = [[participant, [m for m in cursing_messages if m['message']['sender_name']==participant]] for participant in participants]
    swear_list = [ [a[0], reduce(lambda y, x  :concat_matches(x ,y), a[1])['matches']] for a in swears]
    messages_per_participant = {participant: get_message_for_author(participant, messages) for participant in participants}
    word_count_per_participant = {participant: ' '.join([m['content'] for m in messages_per_participant[participant] ]).count(' ') for participant in participants}
    swear_w_ratio = [[a[0], len(a[1]), len(messages_per_participant[a[0]]), word_count_per_participant[a[0]]] for a in swear_list]
    swear_w_ratio = [[a[0], a[1], a[2], a[3], 100*a[1]/a[2], 1000*a[1]/a[3]] for a in swear_w_ratio]
    swear_w_ratio = sorted(swear_w_ratio, key=lambda a : a[5])
    a = next(a[1] for a in swear_list if a[0]==next(iter(participants)))
    print(Counter(a))
    print(Counter(a).items())

    best_swears_per_author = {
        author: sorted(Counter(next(a[1] for a in swear_list if a[0]==author)).items(), key= lambda x :x[1], reverse=True )[:3]
        for author in participants
    }

    summary = [{
        "author" : a[0],
        "swears" : a[1],
        "total_messages" : a[2],
        "total_words" : a[3],
        "percentage of message with swears" : str(a[4])[:4],
        "swear per word" : str(a[5])[:5] +" per 1000",
        "preferred_swear_words" : ' , '.join([f'{word} ({count} fois)' for word, count in best_swears_per_author[a[0]]])
    } for a in swear_w_ratio]
    print(fix_object(summary))
#curse = ['chatte', 'bite']

def remove_accents(s):
    return ''.join((c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn'))

# genpattern = lambda x : '('+'|'.join([f'\\b{curse}s?\\b' for curse in x])+')'
# print(genpattern(curse))
# text =  "j'ai odieusement la châTtes mal a la turbite"

# matches = re.findall(genpattern(curse), remove_accents(text),flags=re.IGNORECASE)
# print(matches)