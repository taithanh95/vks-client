import {Injectable} from '@angular/core';
import {BaseService} from '../shared/base-service/base-service.service';
import {Observable} from 'rxjs';
import {Constant} from '../shared/constants/constant.class';
import {Spp} from '../model/spp.model';
import { WebUtilities } from '../shared/utils/qla-utils.class';

@Injectable()
export class CategoriesService extends BaseService {
  getSppId(): any {
    const userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    if (userInfo) {
      return userInfo.sppid;
    }
    return '';
  }

  getPolSelect(query: any): Observable<any> {
    const params = {
      page: 0, size: 10,
      sortField: 'name',
      sortOrder: '',
      polId: '', name: '',
      addr: '', director: '',
      ...query
    };
    return this.get(`/dm/LstPol/getList`, params);
  }

  getPoliceSelect(query: any): Observable<any> {
    const params = {
      page: 0, size: 10,
      sortField: 'name',
      sortOrder: '',
      sppCode: '', name: '',
      addr: '', tel: '',
      fax: '', csppId: '',
      ...query
    };
    return this.get(`/dm/LstPolice/getList`, params);
  }

  getSppSelect(query: any): Observable<any> {
    const params = {
      page: 0, size: 10,
      sortField: 'name',
      sortOrder: '',
      sppCode: '', name: '',
      addr: '', tel: '',
      fax: '', csppId: '',
      ...query
    };
    return this.get(`/dm/LstSPP/getList`, params);
  }

  getSPCSelect(query: any): Observable<any> {
    const params = {
      page: 1, size: 10,
      sortField: 'name',
      sortOrder: '',
      spcId: '', name: '',
      addr: '', sppId: '',
      ...query
    };
    return this.get(`/dm/LstSPC/getList`, params);
  }


  getDecisionNameSelect(query: any): Observable<any> {
    const params = {
      page: 1, size: 10,
      sortField: 'name',
      sortOrder: '',
      id: '', name: '',
      applyFor: '', userFor: '',
      status: '', applyFinish: '',
      deciType: '',
      ...query
    };
    return this.get(`/dm/LstDecision/getList`, params);
  }

  getListInspector(): Observable<any[]> {
    const sppId = this.getSppId();
    return this.get(`/dm/LstInspector/getListLstInspectorBySppId?sppId=${sppId}`);
  }

  getListInspectorByPosition(position: string): Observable<any[]> {
    const sppId = this.getSppId();
    return this.get(`/dm/LstInspector/getListLstInspectorBySppIdAndPosition?sppId=${sppId}&position=${position}`);
  }
  getListInspectorByPositionSearchKey(position: string, key: string): Observable<any[]> {
    const sppId = this.getSppId();
    return this.get(`/dm/LstInspector/getListInspectorByPositionSearchKey?sppId=${sppId}&position=${position}&key=${key}`);
  }
  getListSignerAutocomplete(query: any): Observable<any[]> {
    return this.get(`/dm/LstSigner/autocomplete`, query);
  }

  getListPolice(query: any): Observable<any[]> {
    if (query === ' ') {
      query = '0';
    }
    return this.get(`/dm/LstPolice/autocomplete/${query}`, null);
  }

  searchVKS(payload): any {
    return this.get(`/dm/LstSPP/getList`, payload);
  }

  getListVKS(query: any): Observable<any[]> {
    if (query === ' ') {
      query = '0';
    }
    return this.get(`/dm/LstSPP/autocomplete/${query}`, null);
  }

  ///dm/LstSPP/spps/{id}
  // getChildSpp(parentId): Observable<any[]> {
  //   return this.get(`/dm/LstSPP/spps/${parentId}`, null);
  // }

  getChildSpp(parentId): Observable<Spp[]> {
    return this.post(`/spp/findAllByParent/`, {SPPID: parentId}, {}, 'manage');
  }

  getListInvestigativeAgency(query: any): Observable<any> {
    const params = {
      pageNumber: 0,
      pageSize: 10,
      sortField: 'name',
      sortOrder: 'ASC',
      dataRequest:{
        name: '',
        ...query
      }
    };
    return this.post(`/investigativeAgency/getPage/`, params,{}, 'manage');
  }

  getListToaAn(query: any): Observable<any[]> {
    if (query === ' ') {
      query = '0';
    }
    return this.get(`/dm/LstSPC/autocomplete/${query}`, null);
  }


  getListLocation(query: any): Observable<any[]> {
    if (query === ' ') {
      query = '0';
    }
    return this.get(`/dm/LstLocation/autocomplete/${query}`, null);
  }

  getLocationById(id: any): Observable<any> {
    return this.get(`/dm/LstLocation/getLocationId/${id}`, null);
  }

  getListArmy(query: any): Observable<any[]> {
    if (query === ' ') {
      query = '0';
    }
    return this.get(`/dm/LstArmy/autocomplete/${query}`, null);
  }

  getListCustoms(query: any): Observable<any[]> {
    if (query === ' ') {
      query = '0';
    }
    return this.get(`/dm/LstCustoms/autocomplete/${query}`, null);
  }

  getListRangers(query: any): Observable<any[]> {
    if (query === ' ') {
      query = '0';
    }
    return this.get(`/dm/LstRanger/autocomplete/${query}`, null);
  }

  getListBorderGuards(query: any): Observable<any[]> {
    if (query === ' ') {
      query = '0';
    }
    return this.get(`/dm/LstBorderGuards/autocomplete/${query}`, null);
  }

  getListPol(payload): Observable<any> { // Danh sách POL
    return this.get('/dm/LstPol/getList', payload);
  }

  getListCountry(payload): Observable<any> { // Quốc gia
    return this.get('/dm/LstCountry/getList', payload);
  }

  getListDecision(payload): Observable<any> { // Quyết định
    return this.get('/dm/LstDecision/getList', payload);
  }

  getListDecision_ForTBTG(payload): Observable<any> { // Quyết định cho phần tin báo
    return this.get(`/dm/LstDecision/getListApplyForTBTG`, payload);
  }

  getDeciAutocomplete(query): Observable<any> { // Autocomplete quyết định
    return this.get(`/dm/LstDecision/autocomplete?query=${query}`, null);
  }

  getListLawAutoComplete(query: any, code: any): Observable<any[]> {
    if (query === ' ') {
      query = '0';
    }
    return this.get(`/dm/LstLaw/autocomplete/${query}/${code}`, null);
  }

  getLawByCode(lawcode: any): any {
    return this.get(`/dm/LstLaw/get/${lawcode}`, null);
  }

  getListLawAutoCompleteWithoutType(query: any): Observable<any[]> {
    if (query === ' ') {
      query = '0';
    }
    return this.get(`/dm/LstLaw/search/${query}`, null);
  }

  getLawByCasecode(query: any): Observable<any[]> {
    return this.get('/SppCase/searchLawByCase', query);
  }

  getListDecision_ForHS(payload): Observable<any> { // Quyết định
    return this.get('/dm/LstDecision/searchForHS', payload);
  }

  getListDecitype(payload): Observable<any> { // Loại quyết định
    return this.get('/dm/LstDecitype/getList', payload);
  }

  getListDecitypeAccu(payload): Observable<any> { // Loại quyết định #3
    return this.get('/dm/LstDecitype/searchDecitypeAccu', payload);
  }

  getListDecitypeUseFor(payload): Observable<any> { // Loại quyết định #2
    return this.get('/SppDecision/searchDecitype', payload);
  }


  getListReason(payload): Observable<any> { // Lý do
    return this.get('/dm/LstReason/getList', payload);
  }

  loadLstReason(payload): Observable<any> { // Lý do 2
    return this.get('/dm/LstReason/loadLstReason', payload);
  }

  getListReligion(payload): Observable<any> { // Tôn giáo
    return this.get('/dm/LstReligion/getList', payload);
  }

  getListNation(payload): Observable<any> { // Dân tộc
    return this.get('/dm/LstNation/getList', payload);
  }

  getListKnowledge(payload): Observable<any> { // Học vấn
    return this.get('/dm/LstKnowledge/getList', payload);
  }

  getListOccupation(payload): Observable<any> { // Nghề nghiệp
    return this.get('/dm/LstOccupation/getList', payload);
  }

  getListParty(payload): Observable<any> { // Đảng
    return this.get('/dm/LstParty/getList', payload);
  }

  getListOffice(payload): Observable<any> { // Chức vụ
    return this.get('/dm/LstOffice/getList', payload);
  }

  getListCode(code): Observable<any> { // Get bộ luật
    return this.get('/SppAccused/getListCode?code=' + code);
  }

  getListLawGroup(code): Observable<any> { // Get chương luật
    return this.get('/SppAccused/getListLawGroup?code=' + code);
  }

  searchLaw(payload): Observable<any> { // Get điều luật
    payload.sortOrder = 'ASC';
    return this.get('/SppAccused/searchLaw', payload);
  }

  searchCenLaw(payload): Observable<any> { // Get điều luật
    payload.sortOrder = 'ASC';
    return this.post('/SppCenLaw/searchCenLaw', payload);
  }

  getLstInspectorByQueryNPC(query: any, sppId: any): Observable<any[]> {
    return this.get(`/dm/LstInspector/loadInsList_npc?sppId=${sppId}&query=${query}`, null);
  }

  getLstInspectorByQuery(query: any, position: any, sppId: any): Observable<any[]> {
    return this.get(`/dm/LstInspector/loadInsList/${sppId}/${position}/${query}`, null);
  }

  getPositionName(posType: string): any {
    let posName = '';
    if (posType === 'KS') {
      posName = 'Kiểm sát viên';
    } else if (posType === 'DT') {
      posName = 'Điều tra viên';
    } else if (posType === 'PC') {
      posName = 'KSV được phân công';
    } else if (posType === 'TG') {
      posName = 'KSV tham gia phiên tòa';
    }
    return posName;
  }

  getPoliceNameBySppId(sppId: any): Observable<any> {
    return this.get(`/dm/LstPolice/getNameBySppId/${sppId}`, null, 'text');
  }

  getListPoliceAndPolByName(name: string): Observable<any[]> {
    return this.get(`/dm/LstPolAndPolice/getListComboBox`, {name});
  }

  getListLaw(payload): Observable<any> { // Get điều luật
    return this.get('/dm/LstLaw/getList', payload);
  }

  getNameBySppId(sppId: number): Observable<any> { // Get điều luật
    return this.get(`/dm/LstSPP/getNameBySppId/${sppId}`, null, 'text');
  }

  getLawByLawCode(lawCode: string): Observable<any> { // Get điều luật
    return this.get(`/dm/LstLaw/get/${lawCode}`);
  }

  getLstAgainstName(payload: any): Observable<any> { // Get kháng nghị
    return this.get('/dm/LstAgainst/getList/',payload);
  }

  getPoliceFromBySppId(sppId: any): Observable<any> {
    return this.get(`/dm/LstPolice/getfromspp?sppid=${sppId}`, null);
  }

  getArmyBySppId(sppId: any): Observable<any> {
    return this.get(`/dm/LstArmy/getArmyBySppId?sppid=${sppId}`, null);
  }

  getCustomsBySppId(sppId: any): Observable<any> {
    return this.get(`/dm/LstCustoms/getCustomsBySppId?sppid=${sppId}`, null);
  }

  getRangerBySppId(sppId: any): Observable<any> {
    return this.get(`/dm/LstRanger/getRangerBySppId?sppid=${sppId}`, null);
  }

  getBorderGuardsBySppId(sppId: any): Observable<any> {
    return this.get(`/dm/LstBorderGuards/getBorderGuardsBySppId?sppid=${sppId}`, null);
  }

  getListAppealName(query: any): Observable<any[]> {
    return this.get(`/SppAppeal/lstAppeals`, null);
  }
  getListAgainstName(query: any): Observable<any[]> {
    return this.get(`/SppAgainst/loadLstAgainsts`, null);
  }

  loadLstAgainstResult(query: any): Observable<any[]> {
    return this.get(`/SppAgainst/loadLstAgainstResult?id=${query}`, null);
  }
  getAppealAcc(query: any): Observable<any[]> {
    return this.get(`/SppAppeal/getAppealAcc?appecode=${query}`, null);
  }
  getAgainstCase(query: any): Observable<any[]> {
    return this.get(`/SppAgainst/getAgacase?againstcode=${query}`, null);
  }
  getIsCheckTransDate(query: any): Observable<any[]> {
    return this.get(`/SppAgainst/isCheckTransdate?regicode=${query}`, null);
  }

  getIsCheckAgainst(query: any): any {
    return this.get(`/SppAgainst/isCheck?regicode=${query}`, null);
  }

  getListSppSendName(search): any{
    return this.get('/SppSend/getListSpp',search);
  }
  getListTransfer(search): any{
    return this.get('/SppSend/getListTransfer',search);
  }
  getTransferByTransId(query): any{
    return this.get(`/SppReveice/getTransferByTransId?transid=${query}`,null);
  }

  getListConclution(userfor,query?): any{
    if (!query)
      query = `userfor=${userfor}`;
    else
      query = `concid=${query}&userfor=${userfor}`;
    return this.get(`/dm/LstConclusion/autocomplete?${query}`,null);
  }

  getConclution(concid): any {
    return this.get(`/dm/LstConclusion/getConclution?concid=${concid}`,null);
  }

  getFromSpp(query): any{
    return this.get(`/dm/LstSPC/getfromspp/${query}`,null);
  }

  getFromSpp2022(query): any{
    return this.get(`/dm/LstSPC/getfromspp2022/${query}`,null);
  }

  getInspectorByinpcode(inspcode: any): any {
    return this.get(`/dm/LstInspector/getByInspcode/${inspcode}`,null);
  }

  getDecisionByDeciId(deciId): Observable<any> {
    return this.get(`/dm/LstDecision/getDecisionById?deciid=${deciId}`,null);
  }

  getAllPol(): Observable<any[]> {
    return this.get('/dm/LstPol/getAll',null);
  }

  insertOccupation(payload): Observable<any> { // Thêm nghề nghiệp
    // return this.post(`/dm/LstOccupation/insert?name=${name}`,null);
    return this.post('/dm/LstOccupation/insert',payload,null,'text');
  }

  deleteOccupation(occuid): Observable<any> { // Thêm nghề nghiệp
    // return this.post(`/dm/LstOccupation/insert?name=${name}`,null);
    return this.post(`/dm/LstOccupation/delete?occuid=${occuid}`,null);
  }

  getLstSpp(query) {
    if (!query) {
      query = '';
    }
    const sppid = WebUtilities.getLoggedSppId();
    return this.get(`/dm/LstSPP/getListSpp?query=${query}&sppid=${sppid}`,null);
  }

  getAllDecitype(): Observable<any[]> {
    return this.get('/dm/LstDecitype/getLstDecitype',null);
  }

  getSppBySppid(sppid: string) {
    return this.get(`/dm/LstSPP/getBySppid?sppid=${sppid}`,null);
  }

  getFnFindDecision(payload) {
    return this.get(`/dm/LstDecision/find`,payload)
  }

  getTreeDataLocation(payload) {
    return this.get(`/dm/LstLocation/getTreeData`,payload)
  }

  getTreeDataSPC(payload) {
    return this.get(`/dm/LstSPC/getTreeData`,payload)
  }

  getTreeDataSPP(payload) {
    return this.get(`/dm/LstSPP/getTreeData`,payload)
  }

  getTreeDataCustoms(payload) {
    return this.get(`/dm/LstCustoms/getTreeData`,payload)
  }

  getTreeDataArmy(payload) {
    return this.get(`/dm/LstArmy/getTreeData`,payload)
  }

  getTreeDataRanger(payload) {
    return this.get(`/dm/LstRanger/getTreeData`,payload)
  }

  getTreeDataPolice(payload) {
    return this.get(`/dm/LstPolice/getTreeData`,payload)
  }

  getTreeDataBorguards(payload) {
    return this.get(`/dm/LstBorderGuards/getTreeData`,payload)
  }
}

