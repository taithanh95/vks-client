import {Injectable} from '@angular/core';
import {BaseService} from '../shared/base-service/base-service.service';
import {Observable} from 'rxjs';
import {WebUtilities} from "../shared/utils/qla-utils.class";
import {Constant} from "../shared/constants/constant.class";

@Injectable()
export class GeneralService extends BaseService {
  jsonError: any;
  jsonErrorQTHT: any;
  jsonErrorDM: any;

  getInitialData(): any {
    return this.get('/Login/GetInitialData');
  }

  getSystemConfig(): any {
    return this.get('/SystemConfig');
  }

  updateSystemConfig(item: any): any {
    return this.put('/SystemConfig/' + item.id, item, 'text');
  }


  // User login
  getUserLogin(username, password): Observable<any[]> {
    /*return this.get('/getUserLogin?password=' + password + '&userId=' + username);*/
    return this.get('/getUserLogin');
  }

  getUserInfo(username): Observable<any> {
    return this.getByUrl(this.constantService.CATEGORY_URL, 'user?username=' + username);
  }

  // Quan ly an
  /// test/getListUpdateInfo
  deleteSppCase(code: any): any {
    return this.post(`/SppCase/delete?casecode=${code}`, null);
  }

  getListUpdateInfo(item: any): Observable<any> {
    return this.post('/SppCase/getListUpdateInfo', item);
  }

  getSppByCode(code): Observable<any[]> {
    const filter = {pageSize: 1, sortOrder: 'ASC', sppcase: {casecode: code}};
    return this.post('/SppCase/getListUpdateInfo', filter);
  }

  addBanAn(item: any): any {
    return this.post('/SppCase/insert', item, null, 'text');
  }

  updateBanAn(item: any): any {
    return this.post('/SppCase/update', item);
  }

  updateCaselawcodewithwarn(item: any): any {
    return this.post('/SppCase/updateCaselawcodewithwarn', item);
  }

  // Insert/update/delete case law with warn
  insertUpdateDeleteCaseLaw(item: any): any {
    return this.post('/SppCase/insertUpdateDeleteCaseLaw', item);
  }

  searchListCaseLaw(item: any): any {
    return this.post('/SppCase/searchListCaseLaw', item);
  }

  deleteCaseLaw(payload: any): any {
    return this.post('/SppCase/deleteCaseLawUpdateInfo', payload);
  }

  // /dm/LstBorderGuards/getList
  getLstBorderGuards(search: any): Observable<any[]> {
    return this.get('/dm/LstBorderGuards/getList', search);
  }

  getLstBorderGuardsByQuery(keyword: any): Observable<any[]> {
    return this.get('/dm/LstBorderGuards/autocomplete/' + keyword, {query: keyword});
  }

  getListCaseLawBySppCase(search: any): any {
    return this.get('/SppCase/getListCaseLaw', search);
  }

  getListRegisterBySppCase(search: any): any {
    return this.get('/SppRegister/getList', search);
  }

  getListPropoAssign(search: any): any {
    return this.get('/SppPropoAssign/loadInspModel', search);
  }

  getListDecision(search: any): any {
    return this.get('/SppDecision/search', search);
  }

  getListAccuByCentCode(code: any): any {
    return this.get('/SppCentence/getaccufromcentcode?centcode=' + code, null);
  }

  getListCentence(search: any): any {
    return this.get('/SppCentence/search', search);
  }

  getListReportAppeal(search: any): any {
    return this.post('/reportAppeal/search', search, null);
  }

  saveReportAppeal(item: any): any {
    return this.post('/reportAppeal/insertOrUpdate', item, null);
  }

  deleteReportAppeal(id): any {
    return this.post(`/reportAppeal/delete?id=${id}`, null,);
  }

  getListCentLaw(search: any): any {
    return this.get('/SppCenLaw/searchFromAccuUpdateInfo', search);
  }

  getListCenPenalty(search: any): any {
    return this.get('/SppCenPenalty/search', search);
  }

  getListJudgement(search: any): any {
    return this.get('/SppJudgement/search', search);
  }

  getListStatica(search: any): any {
    return this.get('/SppStatistica/search', search);
  }

  getListSppSpcPol(search: any): any {
    return this.get('/SppSpcPol/getList', search);
  }

  getListAccu(search: any): any {
    return this.get('/SppAccused/search', search);
  }

  getListVictim(search: any): any {
    return this.get('/SppAccused/search', search);
  }

  deleteAccu(code: any): Observable<any> {
    return this.post('/SppAccused/delete?code=' + code, null);
  }

  checkRegisterDecision(code: any): Observable<any> {
    return this.post('/SppAccused/delete?code=' + code, null, null, 'manage');
  }

  deleteVictim(item: any): any {
    return this.post('/sppdamaged/deleteById/', item, null, 'text');
  }

  saveRegister(item: any): any {
    return this.post('/SppRegister/save', item, null, 'text');
  }

  insertPropoAssign(item: any): any {
    return this.post('/SppPropoAssign/insert', item, null, 'text');
  }

  updatePropoAssign(item: any): any {
    return this.post('/SppPropoAssign/update', item, null, 'text');
  }

  deleteRegins(casecode: any, inspcode: any, regicode: any): Observable<any> {
    return this.post(`/SppPropoAssign/delete?casecode=${casecode}&inspcode=${inspcode}&regicode=${regicode}`, null);
  }

  deleteRegister(code: any): Observable<any> {
    return this.post('/SppRegister/delete?code=' + code, null);
  }

  deleteDecision(item: any): any {
    return this.post('/SppDecision/delete', item, null, 'text');
  }

  deleteDecisionAcc(code): any {
    return this.post('/SppDecision/deleteAcc?decicode=' + code, null);
  }

  deleteCentenceG1(payload): any {
    return this.post('/SppCentence/delete', payload, null);
  }

  deleteUpdateInfoCentenceG1(payload): any {
    return this.post('/SppCentence/deleteUpdateinfo', payload, null, 'text');
  }

  deleteCentLaw(payload: any): any {
    return this.post('/SppCenLaw/delete', payload);
  }

  checkRegisterable(payload: any): any {
    return this.post('/SppRegister/registerable', payload, null, 'text');
  }

  saveSppAccused(item: any): any {
    return this.post('/SppAccused/save', item, null, 'text');
  }

  saveSppVictim(item: any): any {
    return this.post('/sppdamaged/insert/', item, null, 'text');
  }

  saveCentLaw(payload: any): any {
    return this.post('/SppCenLaw/save', payload);
  }

  updateCenPenalty(payload: any): any {
    return this.post('/SppCenPenalty/save', payload);
  }

  updateJudgement(payload: any): any {
    return this.post('/SppJudgement/save', payload);
  }

  updateStatics(payload: any): any {
    return this.post('/SppStatistica/save', payload);
  }

  updateTotalCenPenalty(payload: any): any {
    return this.post('/SppCenPenalty/inserUpdTotal', payload);
  }

  findBySppDamagedIdCaseCode(item: any): any {
    return this.post('/sppdamaged/findByIdCaseCode/', item, null);
  }

  updateBC(item: any): any {
    return this.post('/SppUpdateAccused/insertDelete', item, null);
  }

  saveSppDecisionCase(item: any): any {
    return this.post('/SppDecision/save', item, null, 'text');
  }

  saveSppDecisionAccu(item: any): any {
    return this.post('/SppDecision/saveAcc', item, null, 'text');
  }

  saveSppDecisionAccus(item: any): any {
    return this.post('/SppDecision/saveAcc', item);
  }

  saveSppCentenceG1(item: any): any {
    return this.post('/SppCentence/save', item, null);
  }

  saveSppSpcPol(item: any): any {
    return this.post('/SppSpcPol/save', item, null);
  }

  getLstLawByAccu(accuCode) {
    return this.get('/SppAccused/findLawcode', {accucode: accuCode});
  }

  getSppAccadditioninfoByAcuucode(accuCode) {
    return this.get('/SppAccadditioninfo/getSppAccadditioninfoByAcuucode', {accucode: accuCode});
  }

  getSppViolantionByAcuucode(accuCode) {
    return this.get('/SppViolantion/getSppViolantionByAcuucode', {accucode: accuCode});
  }

  getListPreventiveMeasures(accuCode) {
    return this.get('/preventMeasures/search', {accucode: accuCode});
  }

  deleteViolantionById(id) {
    return this.get('/SppViolantion/deleteById', {idViolantion: id});
  }

  getLstCaseCodeAccu(arresteeId): any {
    return this.get(`/SppAccused/findCaseCode?arresteeId=${arresteeId}`, null)
  }

  toUserForName(userFor): any {
    switch (userFor) {
      case 'G1':
        return 'Kiểm sát điều tra';
      case 'G2':
        return 'Kiểm sát GQA - Truy tố';
      case 'G3':
        return 'Sơ thẩm';
      case 'G4':
        return 'Phúc thẩm';
      case 'G5':
        return 'Giám đốc thẩm / Tái thẩm';
      case 'G6':
        return 'Thi hành án';
    }
    return '';
  }

  searchCaseStatic(search: any): any {
    return this.get('/SppCase/searchCaseStatic', search);
  }

  searchCaseStatis(search: any): any {
    return this.get('/SppStatistica/searchStaticcLawcodeUpdateInfo', search);
  }

  insertStaticcBegin(payload: any): any {
    return this.post('/SppCase/insertStaticcBegin', payload, null, 'text');
  }

  insertCaseStatis(payload: any): any {
    return this.post('/SppStatistica/insertCaseStatis', payload, null, 'text');
  }

  searchExhibit(search: any): any {
    return this.get('/SppCase/searchExhibit', search);
  }

  insertCaseExhibit(payload: any): any {
    return this.post('/SppCase/insertCaseExhibit', payload, null, 'text');
  }

  searchHeroin(search: any): any {
    return this.get('/SppCase/searchHeroin', search);
  }

  getAllHeroin(search?: any): any {
    return this.get('/dm/LstHeroin/getall', null);
  }

  insertCaseHeroin(payload: any): any {
    return this.post('/SppCase/insertCaseHeroin', payload);
  }

  updateCaseHeroin(payload: any): any {
    return this.post('/SppCase/updateCaseHeroin', payload);
  }

  searchInvestment(search: any): any {
    return this.get('/SppCase/searchInvestment', search);
  }

  searchLawByCase(search: any): any {
    return this.get('/SppCase/searchLawByCase', search);
  }

  // @ts-ignore
  readPropertiesJava(fieldName): any {
    fieldName = fieldName.replace('|', '');
    const data = this.configService.getConfig().hsProperties.hsBundle;
    const x = this.extractProperties(data);
    return x[fieldName];
  }

  loadErrorFile() {
    setTimeout(async () => {
      this.readErrorFile();
      this.readErrorFileQTHT();
      this.readErrorFileDM();
    }, 100)

  }

  readErrorFile(): any {
    return this.httpClient.get('assets/properties/ERRBundle.txt', {responseType: 'text'}).subscribe(data => {
      const x = this.extractProperties(data);
      this.jsonError = x;
    });
  }

  readErrorFileQTHT(): any {
    return this.httpClient.get('assets/properties/QTHTBundle.txt', {responseType: 'text'}).subscribe(data => {
      const x = this.extractProperties(data);
      this.jsonErrorQTHT = x;
    });
  }

  readErrorFileDM(): any {
    return this.httpClient.get('assets/properties/DMBundle.txt', {responseType: 'text'}).subscribe(data => {
      const x = this.extractProperties(data);
      this.jsonErrorDM = x;
    });
  }

  extractProperties(data): any {
    const keyValuePairs = data.split('\n');
    const properties = {};
    for (let i = 0; i < keyValuePairs.length; i++) {
      const keyValueArr = keyValuePairs[i].trim().split('=');
      const key = keyValueArr[0];
      const value = keyValueArr[1];
      properties[key] = value;
    }
    return properties;
  }

  getListAppealByRegiCode(search: any): any {
    return this.get('/SppAppeal/searchByRegicode', search);
  }

  getListAgainstByRegiCode(search: any): any {
    return this.get('/SppAgainst/searchByRegicode', search);
  }

  getListAppealByCasecode(search: any): any {
    return this.get('/SppAppeal/searchByCasecode', search);
  }

  getListAgainstByCasecode(search): any {
    return this.get('/SppAgainst/searchByCasecode', search);
  }


  saveAppeal(item: any): any {
    return this.post('/SppAppeal/save', item, null);
  }

  saveAgainst(item: any): any {
    return this.post('/SppAgainst/save', item, null);
  }

  saveAgainstResult(item: any): any {
    return this.post('/SppAgainst/updateResult', item, null);
  }

  deleteAgainst(payload): any {
    return this.post('/SppAgainst/delete', payload, null);
  }

  deleteAppeal(code): any {
    return this.post(`/SppAppeal/delete?code=${code}`, null, null);
  }

  getListSppSend(search): any {
    return this.post('/SppSend/getListSppSend', search);
  }

  getListSppTinh(search): any {
    return this.get('/SppSend/getListSppTinh', search);
  }

  getListSppHuyen(sppid): any {
    return this.get(`/SppSend/getListSppHuyen?sppid=${sppid}`, null);
  }

  insertRequest(payload): any {
    return this.post('/SppSend/insertRequest', payload);
  }

  updateSppSend(payload): any {
    return this.post('/SppSend/update', payload, null);
  }

  searchRequest(payload): any {
    return this.post('/SppSend/searchRequest', payload, null);
  }

  getListSppReveice(search): any {
    return this.post('/SppReveice/getList', search);
  }

  updateSppReveice(payload): any {
    return this.post('/SppReveice/update', payload, null);
  }

  getListUpdateInfoG6(search: any): Observable<any> {
    return this.post('/SppExecuteJudgment/getListUpdateInfo', search, null, 'qlahs');
  }

  updateEnforcement(payload): any {
    return this.post('/SppEnforcement/update', payload, null, 'qlahs')
  }

  deleteEnforcement(payload): any {
    return this.post('/SppEnforcement/delete', payload, null, 'qlahs')
  }

  getListRegisterG6(search): any {
    return this.post('/register/searchRegister', search, null, 'qlahs')
  }

  saveRegisterG6(item: any): any {
    return this.post('/register/saveSppRegister', item, null, 'qlahs');
  }

  deleteRegisterG6(code: any): Observable<any> {
    return this.post('/register/delete', code, null, 'qlahs');
  }

  checkRegisterableG6(payload: any): any {
    return this.post('/register/checkRegisterableG6', payload, null, 'qlahs');
  }

  getListExcecutionG6(search): Observable<any> {
    return this.post('/sppExecution/searchExecution', search, null, 'qlahs');
  }

  getListDecisionG6(search): Observable<any> {
    return this.post('/sppDecisionAcc/search', search, null, 'qlahs');
  }

  insertUpdatePropoAssignG6(item: any): Observable<any> {
    return this.post('/SppPropoAssign/insertUpdate', item, null, 'qlahs');
  }

  saveDecisionG6(payload: any): Observable<any> {
    return this.post('/sppDecisionAcc/insertUpdate', payload, null, 'qlahs');
  }

  searchDeciDataG6(search: any): Observable<any> {
    return this.post('/sppDecisionAcc/searchDeciData', search, null, 'qlahs');
  }

  getExecutionG6(search: any): Observable<any> {
    return this.post('/sppExecution/getExecution', search, null, 'qlahs');
  }

  getListReport(search: any): Observable<any> {
    return this.post(`/report/getList/?page=${search.pageIndex}&&size=${search.pageSize}`, search, null, 'category');
  }

  saveReport(payload: any): Observable<any> {
    return this.post('/report/createOrUpdate/', payload, null, 'category');
  }

  deleteReport(payload: any): Observable<any> {
    return this.post('/report/delete/', payload, null, 'category');
  }

  getListInfoReport(search): Observable<any> {
    return this.post('/requestReport/search', search, null);
  }

  deleteInfoReport(id): Observable<any> {
    return this.post(`/requestReport/delete?id=${id}`, null);
  }

  insertUpdInfoReport(payload): Observable<any> {
    return this.post('/requestReport/insertOrUpdate', payload, null);
  }

  searchCentApped(payload): Observable<any> {
    return this.get('/SppCentence/searchCentApped', payload, null);
  }

  getCentDetail(payload): Observable<any> {
    return this.get('/SppCentence/getCentDetail', payload, null);
  }

  getDeciDetail(decicode: string): Observable<any> {
    return this.get(`/SppDecision/getDeciDetail?decicode=${decicode}`, null);
  }

  getListAgainsResult(search: any): any {
    return this.get('/SppAgainst/searchForUpdateResult', search);
  }

  getCentAccuDetail(payload): Observable<any> {
    return this.get('/SppCentence/getCentAccu', payload, null);
  }

  saveCentAccu(payload): Observable<any> {
    return this.post('/SppCentence/saveCentAccu', payload, null);
  }

  deleteCentAccu(payload): Observable<any> {
    return this.post('/SppCentence/deleteCentAccu', payload, null);
  }

  saveCentenLaw(payload): Observable<any> {
    return this.post('/SppCentenLaw/save', payload, null);
  }

  getCentenLaw(centcode): Observable<any> {
    return this.get(`/SppCentenLaw/getList?centcode=${centcode}`, null)
  }

  searchCentenLaw(payload): Observable<any> {
    return this.post('/SppCentenLaw/search/', payload);
  }

  searchListSppSplit(search): Observable<any> {
    return this.post('/SppSplit/searchListSppSplit', search);
  }

  saveListSppSplit(payload): Observable<any> {
    return this.post('/SppSplit/saveSppSplit', payload);
  }

  deleteListSppSplit(payload): Observable<any> {
    return this.post('/SppSplit/deleteSppSplit', payload);
  }

  getSppCaseByCasecode(casecode): Observable<any> {
    return this.get(`/SppCase/getSppCase?casecode=${casecode}`, null)
  }

  searchListSppJoin(search): Observable<any> {
    return this.post('/SppJoinCase/getListJoin', search);
  }

  saveListSppJoin(payload): Observable<any> {
    return this.post('/SppJoinCase/save', payload);
  }

  getListSpp(search): any {
    return this.get('/dm/LstInspector/getListSpp', search);
  }

  getListSppIsDepart(search): any {
    return this.get('/dm/LstInspector/getListSppIsDepart', search);
  }

  searchInspector(payload): any {
    return this.post('/dm/LstInspector/search1', payload, null);
  }

  deleteInspector(payload): any {
    return this.post('/dm/LstInspector/delete', payload, null);
  }

  insertOrUpdateInspector(payload): any {
    return this.post('/dm/LstInspector/insertOrUpdate', payload, null);
  }

  changeInspector(payload): any {
    return this.post('/dm/LstInspector/changeInspector', payload, null);
  }

  getLstInspectorByQuery(query: any, underlevel: any, sppId: any): Observable<any[]> {
    if (!query) {
      query = '0';
    }
    return this.get(`/dm/LstInspector/getInspList/${sppId}/${underlevel}/${query}`, null);
  }

  getListSppAutoComplete(query: any, sppid: any): Observable<any[]> {
    if (query === ' ') {
      query = '0';
    }
    return this.get(`/dm/LstSPP/autocompleteForChangeInsp/${query}/${sppid}`, null);
  }

  exportPDF(search: any): any {
    return this.get('/detailcase/exportPDF', search);
  }

  /**
   * @description
   * NHỮNG API ĐỂ XỬ LÝ QUẢN LÝ DANH MỤC
   */

  getLstAdmGroups(payload) {
    return this.get('/dm/AdmGroups/getList', payload);
  }

  saveAdmGroups(payload) {
    return this.post('/dm/AdmGroups/save', payload);
  }

  deleteAdmGroups(groupid) {
    return this.post(`/dm/AdmGroups/delete?groupid=${groupid}`, null);
  }

  getFnTreeForGroup(groupid, module) {
    return this.get(`/dm/AdmGrant/getFnTreeForGroup?groupid=${groupid}&module=${module}`, null);
  }

  saveGrantFnsToGroup(payload) {
    return this.post('/dm/AdmGrant/saveGrantFnsToGroup', payload);
  }

  searchParty(payload): any {
    return this.get('/dm/LstParty/getList', payload);
  }

  insertOrUpdateParty(payload): any {
    return this.post('/dm/LstParty/insertOrUpdate', payload, null);
  }

  deleteParty(payload): any {
    return this.post('/dm/LstParty/delete', payload, null);
  }

  searchOffice(payload): any {
    return this.get('/dm/LstOffice/getList', payload);
  }

  insertOrUpdateOffice(payload): any {
    return this.post('/dm/LstOffice/insertOrUpdate', payload, null);
  }

  deleteOffice(payload): any {
    return this.post('/dm/LstOffice/delete', payload, null);
  }

  deleteAdmDepertments(departid) {
    return this.post(`/dm/AdmDepertments/delete?departid=${departid}`, null);
  }

  getLstAdmDepertments(paylaod) {
    return this.get('/dm/AdmDepertments/getList', paylaod);
  }

  saveAdmDepertments(payload) {
    return this.post('/dm/AdmDepertments/save', payload);
  }

  deleteLstStatistica(statid) {
    return this.post(`/dm/LstStatistica/delete?statid=${statid}`, null);
  }

  getLstStatistica(paylaod) {
    return this.get('/dm/LstStatistica/getList', paylaod);
  }

  saveLstStatistica(payload) {
    return this.post('/dm/LstStatistica/save', payload);
  }

  deleteLstStatisticc(statid) {
    return this.post(`/dm/LstStatisticc/delete?statid=${statid}`, null);
  }

  getLstStatisticc(paylaod) {
    return this.get('/dm/LstStatisticc/getList', paylaod);
  }

  saveLstStatisticc(payload) {
    return this.post('/dm/LstStatisticc/save', payload);
  }

  deleteLstAgainstResult(resultid) {
    return this.post(`/dm/LstAgainstResult/delete?resultid=${resultid}`, null);
  }

  getLstAgainstResult(paylaod) {
    return this.get('/dm/LstAgainstResult/getList', paylaod);
  }

  saveLstAgainstResult(payload) {
    return this.post('/dm/LstAgainstResult/save', payload);
  }

  deleteLstAgainst(againstid) {
    return this.post(`/dm/LstAgainst/delete?againstid=${againstid}`, null);
  }

  saveLstAgainst(payload) {
    return this.post('/dm/LstAgainst/save', payload);
  }

  getLstAppeal(payload) {
    return this.get('/dm/LstAppeal/getList', payload);
  }

  deleteLstAppeal(appealid) {
    return this.post(`/dm/LstAppeal/delete?appealid=${appealid}`, null);
  }

  saveLstAppeal(payload) {
    return this.post('/dm/LstAppeal/save', payload);
  }

  getLstConclusion(payload) {
    return this.get('/dm/LstConclusion/getList', payload);
  }

  deleteLstConclusion(concid) {
    return this.post(`/dm/LstConclusion/delete?concid=${concid}`, null);
  }

  saveLstConclusion(payload) {
    return this.post('/dm/LstConclusion/save', payload);
  }

  searchCustoms(payload): any {
    return this.get('/dm/LstCustoms/getList', payload);
  }

  getid(payload): any {
    return this.get('/dm/LstCustoms/getid', payload, 'text')
  }

  autocompleteLocation(query?: string): Observable<any[]> {
    if (query === ' ') {
      query = '0';
    }
    return this.get(`/dm/LstLocation/autocomplete/${query}`, null);
  }

  getListSppByQuery(search): any {
    return this.get('/dm/LstSPP/getListSpp', search);
  }

  getChildSPPSearch(query): any {
    if (!query) {
      query = '';
    }
    const sppid = WebUtilities.getLoggedSppId();
    return this.get(`/dm/LstSPP/getSpps?query=${query}&sppid=${sppid}`, null);
  }

  insertCustoms(payload): any {
    return this.post('/dm/LstCustoms/insert', payload, null);
  }

  updateCustoms(payload): any {
    return this.post('/dm/LstCustoms/update', payload, null, 'text');
  }

  deleteCustoms(payload): any {
    return this.post('/dm/LstCustoms/delete', payload, null, 'text');
  }

  getLstResolve(payload) {
    return this.get('/dm/LstResolve/getList', payload);
  }

  deleteLstResolve(resolid) {
    return this.post(`/dm/LstResolve/delete?resolid=${resolid}`, null);
  }

  saveLstResolve(payload) {
    return this.post('/dm/LstResolve/save', payload);
  }

  searchCode(payload): any {
    return this.get('/dm/LstCode/getList', payload);
  }

  insertOrUpdateCode(payload): any {
    return this.post('/dm/LstCode/insertOrUpdate', payload, null, 'text');
  }

  deleteCode(payload): any {
    return this.post('/dm/LstCode/delete', payload, null);
  }

  getLstRule(payload) {
    return this.get('/dm/LstRule/getList', payload);
  }

  deleteLstRule(caseType, userFor) {
    return this.post(`/dm/LstRule/delete?caseType=${caseType}&userFor=${userFor}`, null);
  }

  saveLstRule(payload) {
    return this.post('/dm/LstRule/save', payload, null, 'text');
  }

  searchBorguards(payload): any {
    return this.get('/dm/LstBorderGuards/getList', payload, null);
  }

  deleteBorguards(payload): any {
    return this.post('/dm/LstBorderGuards/delete', payload, null, 'text')
  }

  insertBorguards(payload): any {
    return this.post('/dm/LstBorderGuards/insert', payload, null, 'text')
  }

  updateBorguards(payload): any {
    return this.post('/dm/LstBorderGuards/update', payload, null, 'text')
  }

  getId(payload): any {
    return this.get('/dm/LstBorderGuards/getid', payload, 'text')
  }

  getLstTransfer(payload) {
    return this.get('/dm/LstTransfer/getList', payload);
  }

  deleteLstTransfer(transid) {
    return this.post(`/dm/LstTransfer/delete?transid=${transid}`, null);
  }

  saveLstTransfer(payload) {
    return this.post('/dm/LstTransfer/save', payload, null, 'text');
  }

  autocompleteCode(query?: string): Observable<any[]> {
    if (query === ' ') {
      query = '0';
    }
    return this.get(`/dm/LstCode/autocomplete/${query}`, null);
  }

  searchLawGroup(payload): any {
    return this.get('/dm/LstLawGroup/getList', payload);
  }

  insertOrUpdateLawGroup(payload): any {
    return this.post('/dm/LstLawGroup/insertOrUpdate', payload, null, 'text');
  }

  deleteLawGroup(payload): any {
    return this.post('/dm/LstLawGroup/delete', payload, null, 'text');
  }

  deleteLstKnowledge(transid) {
    return this.post(`/dm/LstKnowledge/delete?levelid=${transid}`, null);
  }

  saveLstKnowledge(payload) {
    return this.post('/dm/LstKnowledge/save', payload, null, 'text');
  }

  searchSPC(payload): any {
    return this.get('/dm/LstSPC/getList', payload);
  }

  getidSPC(payload): any {
    return this.get('/dm/LstSPC/getid', payload, 'text')
  }

  insertSPC(payload): any {
    return this.post('/dm/LstSPC/insert', payload, null, 'text');
  }

  deleteSPC(payload): any {
    return this.post('/dm/LstSPC/delete', payload, null, 'text');
  }

  updateSPC(payload): any {
    return this.post('/dm/LstSPC/update', payload, null, 'text');
  }

  saveLstReligion(payload): any {
    return this.post('/dm/LstReligion/save', payload, null, 'text');
  }

  deleteLstReligion(religionid): any {
    return this.post(`/dm/LstReligion/delete?religionid=${religionid}`, null);
  }

  searchLocation(payload): any {
    return this.get('/dm/LstLocation/getList', payload, null);
  }

  insertLocation(payload): any {
    return this.post('/dm/LstLocation/insert', payload, null, 'text');
  }

  updateLocation(payload): any {
    return this.post('/dm/LstLocation/update', payload, null, 'text');
  }

  deleteLocation(payload): any {
    return this.post('/dm/LstLocation/delete', payload, null, 'text');
  }

  getIdLocation(payload): any {
    return this.get('/dm/LstLocation/getid', payload, 'text')
  }

  saveLstNation(payload): any {
    return this.post('/dm/LstNation/save', payload, null, 'text');
  }

  deleteLstNation(natiid): any {
    return this.post(`/dm/LstNation/delete?natiid=${natiid}`, null);
  }

  saveLstCountry(payload): any {
    return this.post('/dm/LstCountry/save', payload, null, 'text');
  }

  deleteLstCountry(counid): any {
    return this.post(`/dm/LstCountry/delete?counid=${counid}`, null, 'text');
  }

  searchSPP(payload): any {
    return this.get('/dm/LstSPP/getList', payload);
  }

  getidSPP(payload): any {
    return this.get('/dm/LstSPP/getid', payload, 'text')
  }

  insertSPP(payload): any {
    return this.post('/dm/LstSPP/insert', payload, null, 'text');
  }

  deleteSPP(payload): any {
    return this.post('/dm/LstSPP/delete', payload, null, 'text');
  }

  updateSPP(payload): any {
    return this.post('/dm/LstSPP/update', payload, null, 'text');
  }

  getListSpcByQuery(search): any {
    return this.get('/dm/LstSPC/getListSpc', search);
  }

  searchArmy(payload): any {
    return this.get('/dm/LstArmy/getList', payload);
  }

  getidArmy(payload): any {
    return this.get('/dm/LstArmy/getid', payload, 'text')
  }

  insertArmy(payload): any {
    return this.post('/dm/LstArmy/insert', payload, null, 'text');
  }

  updateArmy(payload): any {
    return this.post('/dm/LstArmy/update', payload, null, 'text');
  }

  deleteArmy(payload): any {
    return this.post('/dm/LstArmy/delete', payload, null, 'text');
  }

  searchRanger(payload): any {
    return this.get('/dm/LstRanger/getList', payload);
  }

  getidRanger(payload): any {
    return this.get('/dm/LstRanger/getid', payload, 'text')
  }

  insertRanger(payload): any {
    return this.post('/dm/LstRanger/insert', payload, null, 'text');
  }

  updateRanger(payload): any {
    return this.post('/dm/LstRanger/update', payload, null, 'text');
  }

  deleteRanger(payload): any {
    return this.post('/dm/LstRanger/delete', payload, null, 'text');
  }

  saveLstReason(payload): any {
    return this.post('/dm/LstReason/save', payload, null, 'text');
  }

  deleteLstReason(reasonid): any {
    return this.post(`/dm/LstReason/delete?reasonid=${reasonid}`, null, 'text');
  }

  searchPolice(payload): any {
    return this.get('/dm/LstPolice/getList', payload);
  }

  getidPolice(payload): any {
    return this.get('/dm/LstPolice/getid', payload, 'text')
  }

  insertPolice(payload): any {
    return this.post('/dm/LstPolice/insert', payload, null, 'text');
  }

  updatePolice(payload): any {
    return this.post('/dm/LstPolice/update', payload, null, 'text');
  }

  deletePolice(payload): any {
    return this.post('/dm/LstPolice/delete', payload, null, 'text');
  }

  saveLstDecitype(payload): any {
    return this.post('/dm/LstDecitype/save', payload, null, 'text');
  }

  deleteLstDecitype(decitypeid): any {
    return this.post(`/dm/LstDecitype/delete?decitypeid=${decitypeid}`, null, 'text');
  }

  searchLaw(payload): any {
    return this.get('/dm/LstLaw/getList', payload);
  }

  getListCode(payload): any {
    return this.get('/SppAccused/getListCode', payload);
  }

  getListLawGroup(payload): any {
    return this.get('/SppAccused/getListLawGroup', payload);
  }

  insertLaw(payload): any {
    return this.post('/dm/LstLaw/insert', payload, null);
  }

  updateLaw(payload): any {
    return this.post('/dm/LstLaw/update', payload, null, 'text');
  }

  deleteLaw(payload): any {
    return this.post('/dm/LstLaw/delete', payload, null, 'text');
  }

  searchPol(payload): any {
    return this.get('/dm/LstPol/getList', payload);
  }

  insertOrUpdatePol(payload): any {
    return this.post('/dm/LstPol/insertOrUpdate', payload, null, 'text');
  }

  deletePol(payload): any {
    return this.post('/dm/LstPol/delete', payload, null);
  }

  searchPenalty(payload): any {
    return this.get('/dm/LstPenalty/getList', payload);
  }

  insertOrUpdatePenalty(payload): any {
    return this.post('/dm/LstPenalty/insertOrUpdate', payload, null, 'text');
  }

  deletePenalty(payload): any {
    return this.post('/dm/LstPenalty/delete', payload, null);
  }

  saveLstDecision(payload): any {
    return this.post('/dm/LstDecision/save', payload);
  }

  deleteLstDecision(deciid): any {
    return this.post(`/dm/LstDecision/delete?deciid=${deciid}`, null);
  }

  searchLawPenalty(payload): any {
    return this.get('/dm/LstLawPenalty/getList', payload);
  }

  insertOrUpdateLawPenalty(payload): any {
    return this.post('/dm/LstLawPenalty/insertOrUpdate', payload, null, 'text');
  }

  getListPenaltyByQuery(search): any {
    return this.get('/dm/LstPenalty/getListPenalty', search);
  }

  searchPrison(payload): any {
    return this.get('/dm/LstPrison/getList', payload);
  }

  insertOrUpdatePrison(payload): any {
    return this.post('/dm/LstPrison/insertOrUpdate', payload, null, 'text');
  }

  deletePrison(payload): any {
    return this.post('/dm/LstPrison/delete', payload, null);
  }

  searchLstLawGroupChap(payload): any {
    return this.get('/dm/LstLawGroupChap/getList', payload);
  }

  saveLstLawGroupChap(payload): any {
    return this.post('/dm/LstLawGroupChap/insertOrUpdate', payload);
  }

  deleteLstLawGroupChap(payload): any {
    return this.post('/dm/LstLawGroupChap/delete', null, payload);
  }

  searchLstLawGroupChapById(id: string) {
    return this.get(`/dm/LstLawGroupChap/searchLstById?id=${id}`, null);
  }

  autocompleteLocation2(query: any, level: any): Observable<any[]> {
    return this.get(`/dm/LstLocation/autocomplete2/${query}&${level}`, null);
  }

  /** END API QUẢN LÝ DANH MỤC*/

  //API MENU
  getLstMenu() {
    const payload = {module: '' ,username: localStorage.getItem(Constant.USERID)}
    return this.post(`/dm/AdmGrant/getMenuByModule`, payload);
  }

  /** START API TRA CUU GIAM SAT*/
  searchRegister(payload): any {
    return this.post('/monitor/monitorRegister', payload);
  }

  searchLookupRegister(payload): any {
    return this.post('/lookup/Lookup/register', payload, null);
  }

  getListRegister(payload) {
    return this.post('/lookup/Lookup/lookupregister', payload, null);
  }

  getListLawGroupChap() {
    return this.get('/monitor/getLstLawGroupChap', null);
  }

  searchCase(payload): any {
    return this.post('/monitor/monitorCase' + payload.caseTypeReport, payload);
  }

  searchLaws(payload): any {
    return this.post('/monitor/monitorLaw', payload);
  }

  searchPenaltys(payload): any {
    return this.post('/monitor/monitorPenalty', payload);
  }

  searchAgainst(payload): any {
    return this.post('/monitor/monitorAgainst', payload);
  }

  searchAppeal(payload): any {
    return this.post('/monitor/monitorAppeal', payload);
  }

  searchLookupDecision(payload): any {
    return this.post('/lookup/Lookup/decision', payload, null);
  }

  getListLookupDecision(payload) {
    return this.post('/lookup/Lookup/decision-detail', payload, null);
  }

  getListLookupCentence(payload) {
    return this.post('/lookup/Lookup/centence-detail', payload, null);
  }

  getListCentenceDetail(payload) {
    return this.post('/lookup/Lookup/listCentence', payload, null);
  }

  getListCentLawDetail(payload) {
    return this.post('/lookup/Lookup/listCentLaw', payload, null);
  }

  getListStatisticcDetail(payload) {
    return this.post('/lookup/Lookup/listStatisticc', payload, null);
  }

  getListStatisticaDetail(payload) {
    return this.post('/lookup/Lookup/listStatistica', payload, null);
  }

  searchLookupAgainst(payload): any {
    return this.post('/lookup/Lookup/against', payload, null);
  }

  getListLookupAgainst(payload) {
    return this.post('/lookup/Lookup/against-detail', payload, null);
  }

  //TAB ACCUSED
  searchAccused(payload): any {
    return this.post('/monitorAccused/type_' + payload.typeAccused, payload);
  }

  searchDecision(payload): any {
    return this.post('/monitorDecison/monitorDecison' + payload.typeDecision, payload);
  }

  searchLookupAppeal(payload): any {
    return this.post('/lookup/Lookup/appeal', payload, null);
  }

  getListLookupAppeal(payload) {
    return this.post('/lookup/Lookup/appeal-detail', payload, null);
  }

  searchLookupAccused(payload): any {
    return this.post('/lookup/Lookup/accused', payload, null);
  }

  getLstNation(query): any {
    return this.get(`/dm/LstNation/getNation`, query, null);
  }

  getLstCountry(query): any {
    return this.get(`/dm/LstCountry/getCountry`, query, null);
  }

  getLstOccupation(query): any {
    return this.get(`/dm/LstOccupation/getOccupation?query=${query}`, null);
  }

  getListLookupAccused(payload) {
    return this.post('/lookup/Lookup/accused-detail', payload, null);
  }

  //TAB TRANSFER
  searchTransfer(payload): any {
    return this.post('/monitorTransfer/type_' + payload.typeTransfer, payload);
  }

  //TAB VERIFY
  searchVerify(payload): any {
    return this.post('/monitorVerify/list', payload);
  }

  searchLookupPenalty(payload): any {
    return this.post('/lookup/Lookup/penalty', payload, null);
  }

  searchLookupLaw(payload): any {
    return this.post('/lookup/Lookup/law', payload, null);
  }

  getListLookupInspector(payload) {
    return this.post('/lookup/Lookup/inspector-detail', payload, null);
  }

  searchLookupTransfer(payload): any {
    return this.post('/lookup/Lookup/transfer', payload,null);
  }

  getLstPolice(query): any {
    return this.get(`/dm/LstPolice/getPoliceByQuery?query=${query}`,null);
  }

  getListLookupTransfer(payload) {
    return this.post('/lookup/Lookup/transfer-detail', payload, null);
  }
  /** END API TRA CUU GIAM SAT*/
}
