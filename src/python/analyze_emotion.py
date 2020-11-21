import os
from os.path import join
import json
from fix_messages import fix_message, fix_text
from collections import Counter

def get_analyzed_emotions(conversation_path):
    messages = generate_message_data(conversation_path)
    messages = [m for m in messages if 'content' in m] # keep only text message
    different_reactions = get_different_reactions(messages)    
    return ({'reaction': fix_text(r), 'best_messages' : get_best_reaction_messages(messages, r)} for r in different_reactions), len(different_reactions)

def get_best_reaction_messages(messages, reaction):
    scores = [[m, get_message_score(m, reaction)] for m in messages]    
    best = sorted(scores, key=lambda x : -x[1])[:10]
    best = [(message, score) for (message, score) in best if score > 0]
    return [{
        'message' : fix_message(message),
        'score' : score
    } for message, score in best]


def get_message_score(message, reaction):
    try:
        return len([r for r in message['reactions'] if r['reaction'] == reaction])
    except KeyError:
        return 0

def get_different_reactions(messages):
    with_reactions = [m for m in messages if 'reactions' in m]
    reactions = [reac['reaction']  for message in with_reactions for reac in message['reactions']]
    return set(reactions)

def generate_message_data(conversation_path):
    message_files = sorted(
        [fname for fname in os.listdir(
            conversation_path) if 'message' in fname],
        key=lambda name: int(name.replace('message_', '').replace('.json', '')))
    message_data = []
    for message_file in message_files:
        with open(join(conversation_path, message_file), 'r') as message_data_file:
            message_data+= json.load(message_data_file)['messages']
    return message_data 
