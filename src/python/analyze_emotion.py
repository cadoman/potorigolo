import os
from os.path import join
import json
from fix_messages import fix_message, fix_text, fix_object
from collections import Counter

def get_analyzed_emotions_for_text(conversation_path):
    return get_analyzed_emotions(conversation_path, 'content')

def get_analyzed_emotions_for_picture(conversation_path):
    return get_analyzed_emotions(conversation_path, 'photos')

def get_analyzed_emotions(conversation_path, required_field):
    messages = load_message_data(conversation_path)
    messages_filtered = [m for m in messages if required_field in m] # keep only text message
    different_reactions = fix_object(get_different_reactions(messages_filtered))
    forbidden_reactions = ['👎', '👍']
    different_reactions = [r for r in different_reactions if r not in forbidden_reactions]
    scores = [[m, get_message_score(m, different_reactions)] for m in messages_filtered]
    best = sorted(scores, key=lambda x : -x[1])[:10]
    best = [(message, score) for (message, score) in best if score > 0]
    return ({
        'message' : fix_message(message),
        'context' : fix_object(get_context(message, messages)),
        'score' : score
    } for message, score in best), len(best)

def get_context(message, messages):
    message_index = next(index for index, m in enumerate(messages) if m['timestamp_ms']==message['timestamp_ms'] )
    # reverse the array so messages are display chronologically
    neighboring_messages = messages[message_index+10:message_index-10:-1]
    one_hour = 3.6e6
    same_moment_messages = [m for m in neighboring_messages if abs(m['timestamp_ms'] - message['timestamp_ms']) < 2 * one_hour]
    return same_moment_messages


def get_message_score(message, reactions):
    try:
        return len([r for r in message['reactions'] if fix_text(r['reaction']) in reactions])
    except KeyError:
        return 0

def get_different_reactions(messages):
    with_reactions = [m for m in messages if 'reactions' in m]
    reactions = [reac['reaction']  for message in with_reactions for reac in message['reactions']]
    return set(reactions)

def load_message_data(conversation_path):
    message_files = sorted(
        [fname for fname in os.listdir(
            conversation_path) if 'message' in fname],
        key=lambda name: int(name.replace('message_', '').replace('.json', '')))
    message_data = []
    for message_file in message_files:
        with open(join(conversation_path, message_file), 'r') as message_data_file:
            message_data+= json.load(message_data_file)['messages']
    return message_data 
