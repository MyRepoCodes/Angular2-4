import { FormGroup } from '@angular/forms';

export class ScrapingValidators {

  public static GameRule(form: FormGroup) {
    let isValid = true;

    const matchRuleForm: FormGroup = <FormGroup>form.controls['matchRules'];
    const resolutionRuleForm: FormGroup = <FormGroup>form.controls['resolutionRules'];

    if (form.controls['entity'].value === 'Game' && resolutionRuleForm.contains('iidHint')) {
      if (resolutionRuleForm.controls['iidHint'].value) {
        isValid = false;
        const gameTimeForm = <FormGroup>matchRuleForm.controls['gameTime'];
        if (gameTimeForm.controls['utcDate'].value) {
          isValid = true;
        } else {
          const scoreForm = <FormGroup>matchRuleForm.controls['score'];
          const scoreNotEmpty = Object.keys(scoreForm.value).reduce((acc, cur) => acc || !!scoreForm.value[cur], false);
          if (gameTimeForm.controls['gameDate'].value && scoreNotEmpty) {
            isValid = true;
          }
        }
      }
    }

    return isValid ? null : { 'rule': 'If you enter IID hint for game you must fill [Game UTC] or [Game Date + score for both teams]' };
  }

  public static GameScore(scoreForm: FormGroup) {
    const ar = !!scoreForm.controls['awayTeamRuns'].value;
    const ah = !!scoreForm.controls['awayTeamHits'].value;
    const ae = !!scoreForm.controls['awayTeamErrors'].value;
    const hr = !!scoreForm.controls['homeTeamRuns'].value;
    const hh = !!scoreForm.controls['homeTeamHits'].value;
    const he = !!scoreForm.controls['homeTeamErrors'].value;

    let isValid = true;

    if (ar || ah || ae || hr || hh || he) {
      isValid = ar && ah && ae && hr && hh && he;
    }

    return isValid ? null : { 'score': 'Partial score entry is not allowed.' };
  }
}
