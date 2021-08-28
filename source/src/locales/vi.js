export default {
    translation: {
        toast: {
            titleSuccess: 'Thành công',
            titleError: 'Lỗi',
            titleWarning: 'Thông tin lỗi'
        }
    },
    masterLayout: {
        breadcrumbs: {
            home: 'Trang chủ',
        },
    },
    navSider: {
        'Account Management': 'Quản lý tài khoản',
        'Admin': 'Quản trị viên',
        'Employee': 'Nhân viên',
        'System': 'Hệ thống',
        'Setting': 'Cài đặt',
        'Role': 'Quyền',
        'Customer': 'Khách hàng',
        'Booking': 'Đặt hàng',
        'Category': 'Danh mục',
        'CategoryImport': 'Danh mục thu',
        'CategoryExport': 'Danh mục chi',
        'CategoryProduct': 'Danh mục sản phẩm',
        'Product': 'Sản phẩm',
        'Orders Management': 'Quản lý đơn hàng',
        'Selling': 'Bán hàng',
        'Selling Management': 'Quản lý bán hàng',
        'Import Management': 'Quản lý thu',
        'Export Management': 'Quản lý chi',
        'Collaborator Management': 'Quản lý CTV',
        'Collaborator Category': 'Danh mục CTV',
    },
    appHeader: {
        profile: 'Hồ sơ',
        logout: 'Đăng xuất',
    },
    constants: {
        Administrator: "Quản trị viên",
        Employee: "Nhân viên",
        Active: "Kích hoạt",
        Unactive: "Khóa",
        Lock: "Khóa",
        Delete: "Xóa",
        Service: 'Dịch vụ',
        Female: 'Nữ',
        Male: 'Nam',
        UndefinedSex: 'Đang cập nhật',
        OtherSex: 'Khác',
        Forbidden: 'Bị cấm',
        Pending: 'Đang chờ',
        Active: 'Hoạt động',
        Pause: 'Tạm dừng',
        Done: 'Hoàn thành',
        Cancel: 'Đã hủy',
    },
    listBasePage: {
        update: 'Cập nhật',
        create: 'Tạo mới',
        success: 'Thành công',
        error: 'Lỗi',
        showSuccessMessage: ' {{ actionName, capitalize }} {{ objectName, lowercase }} thành công!',
        showErrorMessage: ' {{ actionName, capitalize }} {{ objectName, lowercase }} thất bại. Vui lòng thử lại!',
        showDeleteSuccessMessage: 'Xóa {{ objectName, lowercase }} thành công!',
        showDeleteErrorMessage: 'Xóa {{ objectName, lowercase }} thất bại. Vui lòng thử lại!',
        active: 'Hoạt động',
        lock: 'khóa',
        titleConfirm: 'Bạn có chắc muốn {{ actionName, lowercase }} {{ objectName, lowercase }} này?',
        okText: 'Có',
        cancleText: 'Không',
        titleActionCol: 'Hành động',
        titleStatusCol: 'Trạng thái',
    },
    basicModal: {
        updateTitle: 'CẬP NHẬT {{ objectName, uppercase }}',
        createTitle: 'THÊM MỚI {{ objectName, uppercase }}',
        closeButton: 'Đóng',
        saveButton: 'Lưu',
    },
    baseField: {
        select: 'chọn',
        enter: 'nhập',
        requiredMsg: 'Vui lòng {{ action, lowercase }} {{ fieldTitle, lowercase }}',
        imageTooLarge: 'Hình tải lên cần nhỏ hơn 500KB!',
    },
    fileUploadField: {
        clickToUpload: 'Nhấp vào để tải lên',
    },
    cropImageFiled: {
        uploading: 'Đang tải lên',
        upload: 'Tải lên',
    },
    richTextField: {
        limitFileSize: 'Dung lượng hình cần phải nhỏ hơn 512KB. Vui lòng tải lên dung lượng nhỏ hơn!',
    },
    textField: {
        maxLengthMsg: 'Số ký tự không thể nhiều hơn {{ var }}',
        minLengthMsg: 'Số ký tự không thể ít hơn {{ var }}',
        invalidEmailMsg: 'Định dạng email không hợp lệ',
    },
    searchForm: {
        searchButton: 'Tìm kiếm',
        clearButton: 'Làm mới',
    },
    notFound: {
        notFoundMsg: 'Trang bạn đang tìm kiếm không tồn tại',
        goBack: 'Quay lại',
    },
    ForbiddenListPage:{
        breadcrumbs: {
            currentPage: 'Bị cấm'
        },
        message: {
            forbiddenMessage: 'Bạn không có quyền truy cập'
        }
    },
    profilePage: {
        breadcrumbs: {
            currentPage: 'Hồ sơ'
        },
        form: {
            label: {
                avatar: 'Hình đại diện',
                username: 'Tài khoản',
                fullName: 'Họ và tên',
                phone: 'Số điện thoại',
                taxNumber: 'Mã số thuế',
                zipCode: 'Mã Zip',
                city: 'Thành phố',
                address: 'Địa chỉ',
                logo: 'Logo',
                oldPassword: 'Mật khẩu hiện tại',
                newPassword: 'Mật khẩu mới',
                confirmNewPassword: 'Xác nhận mật khẩu mới',
                organizeName: 'Tên đơn vị',
                organizeHotline: 'Đường dây nóng',
                province: 'Tỉnh',
                district: 'Quận/huyện',
                ward: 'Xã/phường',
                contactName: 'Tên liên lạc',
                contactTitle: 'Thông tin người liên lạc',
                Male: 'Nam',
                kind: 'Thể loại',
                identityNumber: 'Mã CMND',
                sex: 'Giới tính',
                birthday: 'Sinh nhật',
                placeOfIssue: 'Nơi cấp',
                dateOfIssue: 'Ngày cấp',
                departmentName: 'Phòng ban',
            },
            fieldSet: {
                profileInfo: 'Thông tin hồ sơ',
                accountInfo: 'Thông tin tài khoản',
                legalInfo: 'Thông tin pháp lý',
            },
            validationMessage: {
                fullNameRequire: 'Vui lòng nhập họ và tên',
                passwordRequire: 'Vui lòng nhập mật khẩu',
                passwordNotMatch: 'Mật khẩu bạn nhập không khớp!',
            }
        },
        message: {
            updateProfileFail: 'Cập nhật hồ sơ thất bại. Vui lòng thử lại!',
            updateProfileSuccess: 'Hồ sơ của bạn đã được cập nhật!',
        },
        button: {
            update: 'Cập nhật',
        }
    },
    userAdminListPage: {
        breadcrumbs: {
            currentPage: 'Quản trị viên'
        },
        objectName: 'quản trị viên',
        searchPlaceHolder: {
            username: 'Tài khoản đăng nhập',
            fullName: 'Họ và tên',
            status: 'Chọn trạng thái',
            organize: 'Chọn đơn vị',
        },
        table: {
            avatar: '#',
            username: 'Tên đăng nhập',
            fullName: 'Họ và tên',
            phone: 'Số điện thoại',
            createdDate: 'Ngày tạo',
            organize: 'Đơn vị',
        },
        form: {
            label: {
                avatar: 'Ảnh đại diện',
                username: 'Tên đăng nhập',
                fullName: 'Họ và tên',
                password: 'Mật khẩu',
                confirmPassword: 'Xác nhận mật khẩu',
                newPassword: 'Mật khẩu mới',
                confirmNewPassword: 'Xác nhận mật khẩu mới',
                groupPermission: 'Nhóm quyền',
                phone: 'Số điện thoại',
                language: 'Ngôn ngữ',
                status: 'Trạng thái',
                organization: 'Đơn vị',
                organizationPlaceHolder: 'Hãy chọn đơn vị',
            },
            validationMessage: {
                phoneLengthRequire: 'Hãy nhập số',
                comparePassword: 'Mật khẩu bạn nhập không khớp!',
            }
        },
        message: {
            // updateProfileFail: 'Your profile failed. Please try again!',
            // updateProfileSuccess: 'Your profile have been updated!'
        },
        createNewButton: 'Tạo {{ var, lowercase }} mới',
    },
    bookingContainer: {
        breadcrumbs: {
            currentPage: "Đặt hàng",
        },
        page: {
            confirm: 'Bạn có chắc muốn xóa sản phẩm này?',
            yes: 'Có',
            no: 'Không',
            searchPlaceHolder: "Nhập tên sản phẩm",
            chooseCategory: "Chọn phân loại",
            categoryList: "Danh sách phân loại",
            payment: "Thanh toán",
            customerInfo: "Thông tin khách hàng",
            phoneNumber: "Số điện thoại",
            fullName: "Họ và tên",
            discount: "Giảm giá",
            address: "Địa chỉ",
            productList: "Danh sách mặt hàng",
            totalProductPrice: "Tổng tiền đơn hàng:",
            totalPayment: "Tổng tiền thanh toán:",
            cart: "Giỏ hàng",
            edit: "Sửa",
            add: "add",
            note: "ghi chú",
            typeHere: "Điền vào đây",
            accept: "Đồng ý",
            next: "Tiếp theo",
        },
        showErrorMessage: {
            booking: "Đặt hàng thất bại. Vui lòng thử lại!",
        },
        showSuccessMessage: {
            booking: "Đặt hàng thành công",
        },
    },
    categoryListPage: {
        breadcrumbs: {
            currentPageImport: 'Danh mục thu',
            currentPageExport: 'Danh mục chi',
            currentPageProduct: 'Danh mục sản phẩm',
        },
        objectNameProduct: 'danh mục sản phẩm',
        objectNameExport: 'danh mục chi',
        objectNameImport: 'danh mục thu',
        searchPlaceHolder: {
            name: 'Tên',
            status: 'Chọn trạng thái',
        },
        table: {
            name: 'Tên',

        },
        form: {
            label: {
                avatar: 'Ảnh đại diện',
                categoryName: 'Tên danh mục',
                categoryDescription: 'Mô tả',
                status: 'Trạng thái',
            },
        },
        createNewButton: 'Tạo {{ var, lowercase }} mới',
    },
}
