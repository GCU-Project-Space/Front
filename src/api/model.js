// =================
// DTO 클래스
// =================

export class User {
  constructor(data = {}) {
    this.id = data.id || null;
    this.email = data.email || '';
    this.nickname = data.nickname || '';
    this.school = data.school || '';
    this.phoneNumber = data.phoneNumber || '';
    this.schoolId = data.schoolId || null;
    this.userType = data.userType || '';
    this.createdAt = data.createdAt || null;
    this.storeId = data.storeId || null;
  }

  // 정적 메서드 - API 응답에서 User 인스턴스 생성
  static fromAPIResponse(apiResponse) {
    if (apiResponse.success && apiResponse.data) {
      return new User(apiResponse.data);
    }
    return null;
  }

  // 사용자 정보 검증
  isValid() {
    return this.nickname && this.email && this.school && this.phoneNumber;
  }

  // JSON 형태로 변환
  toJSON() {
    return {
      id: this.id,
      nickname: this.nickname,
      school: this.school,
      phoneNumber: this.phoneNumber,
      email: this.email,
      schoolId: this.schoolId,
      userType: this.userType,
      createdAt: this.createdAt,
      storeId: this.storeId
    };
  }

  // 비즈니스 로직 메서드들
  getDisplayName() {
    return this.nickname || this.email || '사용자';
  }

  hasSchoolInfo() {
    return this.school && this.schoolId;
  }

  isStoreOwner() {
    return this.storeId !== null && this.storeId !== undefined;
  }
}