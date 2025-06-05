// =================
// API 클래스
// =================

import { apiClient } from './client';

export const userService = {
  // 회원가입
  async signup({ nickname, password, school, phoneNumber, email, schoolId, userType }) {
    return await apiClient.post('/users/signup', {
      nickname,
      password,
      school,
      phoneNumber,
      email,
      schoolId,
      userType
    });
  },

  // 로그인
  async login({email, password}) {
    return await apiClient.post('/users/login', {
      email,
      password
    });
  },

  // 사용자 정보 조회
  async getUserInfo(userId) {
    return await apiClient.get(`/users/${userId}`);
  },

  // 사용자 정보 수정
  async updateUser(userId, { nickname, password, phoneNumber }) {
    return await apiClient.put(`/users/${userId}`, {
        nickname,
        password,
        phoneNumber,
    });
  },
};

export const recruitmentService = {

    // 모집글 생성
    async createRecruitment(data) {
        return await apiClient.post(`/recruitments`, data);
    },

    // 모집글 리스트 조회
    async getRecruitments() {
        return await apiClient.get(`/recruitments`);
    },

    // 특정 모집글 상세 조회
    async getRecruitment(groupId) {
        return await apiClient.get(`/recruitments/${groupId}`);
    },

    // 모집글 삭제
    async deleteRecruitment(groupId) {
        return await apiClient.delete(`/recruitments/${groupId}`);
    },

    // 모집 참여 (주문 추가)
    async joinRecruitment(groupId, orderData) {
        return await apiClient.post(`/recruitments/${groupId}/orders`, orderData);
    },

    // 모집 승인 (가게가 승인)
    async acceptRecruitment(groupId) {
        return await apiClient.put(`/recruitments/${groupId}/accept`);
    },

    // 모집 거절 (가게가 거절)
    async rejectRecruitment(groupId) {
        return await apiClient.put(`/recruitments/${groupId}/reject`);
    },

    // 모집 제출 (최종 주문 확정)
    async submitRecruitment(groupId) {
        return await apiClient.put(`/recruitments/${groupId}/submit`);
    },

    async completeRecruitment(groupId) {
        return await apiClient.put(`/recruitments/${groupId}/complete`);
    },
    
    // 유저별 모집 조회
    async getUserRecruitments(userId) {
        return await apiClient.get(`/recruitments/user/${userId}`);
    },

    // 가게별 모집 조회
    async getStoreRecruitments(storeId) {
        return await apiClient.get(`/recruitments/store/${storeId}`);
    },

    // 카테고리별 모집 조회
    async getRecruitmentsByCategory(category) {
        return await apiClient.get(`/recruitments/category/${category}`);
    }
}

export const storeService = {
    // 가게 추가
    async getStores() {
        return await apiClient.get(`/stores`);
    },

    // 가게 등록
    async addStore({name, phone, location, description, openHours, minOrderPrice}) {
        return await apiClient.post(`/stores`, {
            name,
            phone,
            location,
            description,
            openHours,
            minOrderPrice,
        });
    },

    // 가게 상세 조회
    async getStore(storeId) {
        return await apiClient.get(`/stores/${storeId}`);
    },

    // 가게 삭제
    async deleteStore(storeId) {
        return await apiClient.delete(`/stores/${storeId}`);
    },

    // 가게 메뉴 조회
    async getMenus(storeId) {
        return await apiClient.get(`/stores/${storeId}/menus`);
    },

    // 가게 메뉴 삭제
    async deleteMenu(storeId, menuId) {
        return await apiClient.delete(`/stores/${storeId}/menus/${menuId}`);
    },

    // 가게 메뉴 등록
}

export const orderService = {
    // 주문 조회
    async getOrder(orderId) {
        return await apiClient.get(`/orders/detail/${orderId}`);
    },

    // 주문 취소
}

export const paymentService = {
    // 결제
    async pay(payId) {

    },
}