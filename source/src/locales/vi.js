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
    collaboratorCategoryListPage: {
        breadcrumbs: {
            currentPage: 'Danh mục CTV',
        },
        objectName: 'danh mục CTV',
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
    collaboratorCategoryProductListPage: {
        breadcrumbs: {
            parentPage: 'Danh mục CTV',
            currentPage: 'Danh mục CTV sản phẩm',
        },
        objectName: 'danh mục CTV sản phẩm',
        searchPlaceHolder: {
            productName: 'Tên sản phẩm',
        },
        table: {
            productName: 'Tên sản phẩm',
            commission: 'Hoa hồng',
            back: 'Trở về',
            edit: 'Sửa thông tin',
            productList: 'Danh sách sản phẩm',
            searchPlaceHolder: 'Tìm tại đây',
            product: 'sản phẩm',
            delete: 'Xóa',
            selectAll: 'Chọn tất cả',
            selectCurrent: 'Chọn hiện tại',
            selectInvert: 'Chọn ngược lại',
            removeAll: 'Xóa tất cả',
            removeCurrent: 'Xóa hiện tại',
        },
        form: {
            titleAdd: "THÊM SẢN PHẨM",
            titleUpdate: "CHỈNH SỬA THÔNG TIN",
            money: 'Tiền',
            percent: 'Phần trăm',
            label: {
                kind: 'Loại',
                commission: 'Hoa hồng',
            },
        },
        createPage: {
            confirmDelete: 'Bạn có chắc muốn xóa?',
            yes: 'Có',
            no: 'Không',
        },
        editButton: 'Chỉnh sửa sản phẩm',
        showSuccessMessage: {
            add: 'Thêm sản phẩm thành công!',
            update: 'Cập nhật sản phẩm thành công!',
            delete: 'Xóa thành công!',
        },
        showErrorMessage: {
            add: 'Đã xảy ra lỗi!',
        }
    },
    collaboratorListPage: {
        breadcrumbs: {
            employeePage: 'Nhân viên',
            currentPage: 'Cộng tác viên',
        },
        objectName: 'cộng tác viên',
        searchPlaceHolder: {
            username: 'Tên đăng nhập',
            fullName: 'Họ và tên',
        },
        table: {
            username: 'Tên đăng nhập',
            fullName: 'Họ và tên',
            phone: 'Số điện thoại',
            createdDate: 'Ngày tạo',
            action: 'Hành động',
        },
        form: {
            label: {
                avatar: 'Ảnh đại diện',
                username: 'Tài khoản đăng nhập',
                fullName: 'Họ và tên',
                password: 'Mật khẩu',
                newPassword: 'Mật khẩu mới',
                typeNewPasswordAgain: 'Nhập lại mật khẩu mới',
                typePasswordAgain: 'Nhập lại mật khẩu',
                birthday: 'Ngày sinh',
                phone: 'Số điện thoại',
                address: 'Địa chỉ',
                personalIdentityCard: 'CMND',
                placeOfIssue: 'Nơi đăng ký',
                dateOfIssue: 'Ngày đăng ký',
                bankName: 'Tên ngân hàng',
                bankNo: 'Số tài khoản',
                branchName: 'Chi nhánh',
                status: 'Trạng thái',
                note: 'Ghi chú',
            },
            placeholder: {
                birthday: 'Chọn ngày sinh',
                email: 'Nhập email',
                address: 'Nhập địa chỉ',
                personalIdentityCard: 'Nhập số CMND',
                placeOfIssue: 'Nhập nơi đăng ký',
                dateOfIssue: 'Chọn ngày đăng ký',
                bankName: 'Nhập tên ngân hàng',
                bankNo: 'Nhập STK',
                branchName: 'Nhập chi nhánh',
            },
            fieldset: {
                bank: 'Ngân hàng',
                personalIdentityCard: 'CMND',
                collaboratorInfo: 'Thông tin CTV',
                status: 'Trạng thái',
            }
        },
        validationMessage: {
            password: 'Mật khẩu không khớp vui lòng thử lại',
        },
        createNewButton: 'Tạo {{ var, lowercase }} mới',
    },
    collaboratorProductListPage: {
        breadcrumbs: {
            employeePage: 'Nhân viên',
            collaboratorPage: 'Cộng tác viên',
        },
        objectName: 'sản phẩm CTV',
        searchPlaceHolder: {
            productName: 'Tên sản phẩm',
        },
        table: {
            productName: 'Tên sản phẩm',
            commission: 'Hoa hồng',
            back: 'Trở về',
            edit: 'Sửa thông tin',
            productList: 'Danh sách sản phẩm',
            searchPlaceHolder: 'Tìm tại đây',
            product: 'sản phẩm',
            delete: 'Xóa',
            selectAll: 'Chọn tất cả',
            selectCurrent: 'Chọn hiện tại',
            selectInvert: 'Chọn ngược lại',
            removeAll: 'Xóa tất cả',
            removeCurrent: 'Xóa hiện tại',
        },
        form: {
            titleAdd: "THÊM SẢN PHẨM",
            titleUpdate: "CHỈNH SỬA THÔNG TIN",
            money: 'Tiền',
            percent: 'Phần trăm',
            label: {
                kind: 'Loại',
                commission: 'Hoa hồng',
            },
        },
        createPage: {
            confirmDelete: 'Bạn có chắc muốn xóa?',
            yes: 'Có',
            no: 'Không',
            confirmCreate: 'Bạn có muốn thêm {{ var }} sản phẩm?',
            selectQuick: 'Chọn nhanh',
        },
        editButton: 'Chỉnh sửa sản phẩm',
        showSuccessMessage: {
            add: 'Thêm sản phẩm thành công!',
            update: 'Cập nhật sản phẩm thành công!',
            delete: 'Xóa thành công!',
        },
        showErrorMessage: {
            add: 'Đã xảy ra lỗi!',
        }
    },
    employeeCollaboratorListPage: {
        breadcrumbs: {
            currentPage: 'Nhân viên',
        },
        objectName: 'nhân viên',
        table: {
            fullName: 'Họ và tên',
            countColl: 'Số lượng CTV',
        },
        createNewButton: 'Tạo {{ var, lowercase }} mới',
    },
    employeeListPage: {
        breadcrumbs: {
            currentPage: 'Nhân viên',
        },
        objectName: 'nhân viên',
        searchPlaceHolder: {
            username: 'Tài khoản đăng nhập',
            fullName: 'Họ và tên',
        },
        table: {
            username: 'Tài khoản đăng nhập',
            phone: 'Số điện thoại',
            createdDate: 'Ngày tạo',
            fullName: 'Họ và tên',
            countColl: 'Số lượng CTV',
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
                status: 'Trạng thái',
                labelColor: 'Chọn nhãn màu',
            },
            validationMessage: {
                phoneLengthRequire: 'Hãy nhập số',
                comparePassword: 'Mật khẩu bạn nhập không khớp!',
            }
        },
        createNewButton: 'Tạo {{ var, lowercase }} mới',
    },
    customerListPage: {
        breadcrumbs: {
            currentPage: 'Khách hàng',
        },
        objectName: 'khách hàng',
        searchPlaceHolder: {
            phone: 'Số điện thoại',
            fullName: 'Họ và tên',
        },
        table: {
            phone: 'Số điện thoại',
            createdDate: 'Ngày tạo',
            fullName: 'Họ và tên',
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
                phone: 'Số điện thoại',
                status: 'Trạng thái',
                address: 'Địa chỉ',
            },
            validationMessage: {
                phoneLengthRequire: 'Hãy nhập số',
                comparePassword: 'Mật khẩu bạn nhập không khớp!',
            }
        },
        createNewButton: 'Tạo {{ var, lowercase }} mới',
    },
    imExManagementListPage: {
        breadcrumbs: {
            currentPage: 'Quản lý thu',
            currentPageExport: 'Quản lý chi',
        },
        objectNameExport: 'quản lý chi',
        objectName: 'quản lý thu',
        searchPlaceHolder: {
            code: 'Mã chứng từ',
            status: 'Chọn trạng thái',
            fromDate: 'Từ ngày',
            toDate: 'đến ngày',
            categoryId: 'Chọn danh mục',
        },
        table: {
            code: 'Mã chứng từ',
            date: 'Thời gian',
            money: 'Số tiền (VND)',
            employeeFullName: 'Tên nhân viên',
            categoryName: 'Danh mục',
            note: 'Ghi chú',
        },
        form: {
            label: {
                category: 'Danh mục',
                code: 'Mã chứng từ',
                filePathExport: 'Ảnh chứng từ',
                filePathImport: 'Ảnh chứng từ',
                money: 'Số tiền (VND)',
                date: 'Ngày',
                preview: 'Xem chi tiết',
                note: 'Ghi chú'
            },
        },
        totalExport: 'TỔNG CHI',
        totalImport: 'TỔNG THU',
        createNewButton: 'Tạo {{ var, lowercase }} mới',
        validationMessage: {
            price: 'Giá tiền chỉ bao gồm các ký tự 0-9',
        }
    },
    ordersListPage: {
        breadcrumbs: {
            currentPage: 'Đơn hàng',
        },
        objectName: 'Đơn hàng',
        searchPlaceHolder: {
            code: 'Mã đơn hàng',
            state: 'Chọn tình trạng',
            employeeFullName: 'Tên nhân viên',
        },
        table: {
            ordersCode: 'Mã đơn hàng',
            customerFullName: 'Khách hàng',
            createdDate: 'Ngày tạo',
            employeeFullName: 'Nhân viên',
            ordersTotalMoney: 'Số tiền',
            ordersState: 'Tình trạng',
        },
        form: {
            state: 'Tình trạng đơn hàng',
            label: {
                customerFullName: 'Họ và tên',
                customerPhone: 'Số điện thoại',
                ordersSaleOff: 'Giảm giá',
                ordersAddress: 'Địa chỉ',
            },
            fieldSet: {
                customerInfo: 'Thông tin khách hàng',
                productList: 'Danh sách mặt hàng',
            },
            totalProductPrice: 'Tổng tiền đơn hàng',
            saleOff: 'Giảm giá',
            totalPayment: 'Tổng tiền thanh toán',
        },
        titleModal: "CHI TIẾT ĐƠN HÀNG",
        confirmUpdateState: 'Bạn có chắc muốn thay đổi trạng thái đơn hàng này?',
        yes: 'Có',
        no: 'Không',
        cancelOrders: 'Hủy đơn hàng',
        save: 'Lưu',
        confirmDeleteItem: 'Bạn có chắc muốn xóa sản phẩm này?',
        confirmDeleteFinalItem: 'Xóa sản phẩm cuối cùng sẽ chuyển trạng thái đơn hàng thành \'Đã hủy\' (vẫn giữ lại sản phẩm)! Bạn có muốn thực hiện?',
        validationMessage: {
            price: 'Giá tiền chỉ bao gồm các ký tự 0-9',
        },
        showSuccessMessage: {
            update: 'Cập nhật thành công!',
        },
        showErrorMessage: {
            update: "Cập nhật thất bại. Vui lòng thử lại!",
        },
    },
    productListPage: {
        breadcrumbs: {
            currentPage: 'Sản phẩm',
        },
        objectName: 'sản phẩm',
        searchPlaceHolder: {
            productName: 'Tên sản phẩm',
            status: 'Chọn trạng thái',
        },
        table: {
            productName: 'Họ và tên',
            saleOff: 'Giảm giá',
            price: 'Giá tiền',
            status: 'Trạng thái',
            action: 'Hành động',
        },
        form: {
            label: {
                avatar: 'Hình sản phẩm',
                status: 'Trạng thái',
                productName: 'Tên sản phẩm',
                productPrice: 'Giá tiền',
                saleOff: 'Giảm giá',
                labelColor: 'Chọn nhãn màu',
                reset: 'Đặt lại',
                description: 'Mô tả',
            },
            validationMessage: {
                price: 'Giá tiền chỉ bao gồm các ký tự 0-9',
            }
        },
        createNewButton: 'Tạo {{ var, lowercase }} mới',
    },
}
