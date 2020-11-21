import sys, os
from datetime import datetime
from ftfy import fix_text
import time
import json
from os.path import join
from fix_messages import fix_message

def get_conversation_summary(conv_path):
    message_files = [fname for fname in os.listdir(conv_path) if os.path.splitext(fname)[1]=='.json']
    last_message_file = os.path.join(conv_path, 'message_1.json')
    conversation_summary = {}
    all_messages = []
    with open(last_message_file, 'r') as message_data_file:
        message_data = json.load(message_data_file)
        all_messages = message_data['messages']
        conversation_summary = {
            "title" : fix_text(message_data['title']),
            "last_update" : datetime.utcfromtimestamp(message_data['messages'][0]['timestamp_ms']/1000).isoformat(),
            "id" : message_data['thread_path'].split('/')[1]
        }
    for message_file in message_files:
        if message_file != 'message_1.json':
            fname = os.path.join(conv_path, message_file)
            with open(fname, 'r') as message_data_file:
                message_data = json.load(message_data_file)
                all_messages += message_data['messages']
    conversation_summary['message_count'] = len(all_messages)
    conversation_summary['last_message'] = fix_message(all_messages[0])
    conversation_summary['first_message'] = fix_message(all_messages[-1])
    return conversation_summary

def get_conversations_summary(inbox_path):
    conversations = os.listdir(inbox_path)
    return (get_conversation_summary(join(inbox_path, conv)) for conv in conversations), len(conversations)
