from pprint import pprint
import grammalecte
from collections import Counter
from tqdm import tqdm
from analyze_emotion import load_message_data
from fix_messages import fix_message, fix_text
import numpy as np
import json
from datetime import datetime

ignored_rules = ['nbsp_avant_double_ponctuation',
                 'apostrophe_typographique_après_t',
                 'apostrophe_typographique',
                 'nbsp_ajout_avant_double_ponctuation',
                 'esp_fin_ligne',
                 'nbsp_avant_deux_points',
                 'typo_tiret_début_ligne',
                 'unit_nbsp_avant_unités1',
                 'typo_guillemets_typographiques_doubles_ouvrants',
                 'typo_guillemets_typographiques_doubles_fermants',
                 'typo_points_suspension1',
                 'virgule_manquante_avant_mais',
                 'virgule_manquante_avant_car',
                 'esp_milieu_ligne',
                 'esp_mélangés1',
                 'g1__typo_ordinaux_chiffres_incorrects__b3_a1_1',
                 'g1__typo_À_début_phrase__b1_a1_1',
                 'eepi_écriture_épicène_pluriel_e',
                 'typo_espace_manquant_après2']





def check_errors(conversation_path):
    oGrammarChecker = grammalecte.GrammarChecker("fr")
    for rule in ignored_rules:
        oGrammarChecker.gce.ignoreRule(rule)
    messages = load_message_data(conversation_path)
    participants = fix_text(' '.join(set([m['sender_name'] for m in messages]))).lower()
    print(participants)
    from tqdm import tqdm
    for i, m in tqdm(enumerate(messages), total=len(messages)):
        if 'content' in m :
            m = fix_message(m)
            (m['grammar_errors'], m['spelling_errors']) =check_message_errors(oGrammarChecker,m, participants)
            messages[i] = m
            # print(m['content'])
            # print('envoyé à '+str(datetime.fromtimestamp(m['timestamp_ms']/1000).hour)+'h\tFautes : '+str(len(m['spelling_errors']))+'\n')
    most_common_errors = [m['spelling_errors'][i]['sValue'].lower()  for m in messages  if 'spelling_errors' in m for i in range(len(m['spelling_errors']))]
    most_common_errors = [e for e in most_common_errors if len(e)>2]
    print(Counter(most_common_errors))

def is_night_message(m):
    d = datetime.fromtimestamp(m['timestamp_ms']/1000)
    return d.hour > 2 and d.hour < 6

def check_message_errors(grammarChecker, message, participant_names):
    try:
        errors = grammarChecker.getParagraphErrorsAsJSON(0, message['content'], bContext=True, bEmptyIfNoErrors=False, bSpellSugg=False, bReturnText=True)
        errors = json.loads(errors)
    except Exception as e:
        print(errors)
        raise e
    grammar_errors = errors['lGrammarErrors']
    spelling_errors = errors['lSpellingErrors']
    spelling_errors = [err for err in spelling_errors if not err['sValue'].lower() in participant_names]
    return grammar_errors, spelling_errors
